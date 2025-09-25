import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { eq } from 'drizzle-orm';
import { log } from 'node:console';
import { Readable } from 'node:stream';
import { s3Client } from '../clients/s3Client';
import { db } from '../db';
import { mealsTable } from '../db/schema';
import { getMealDetailsFromImage, getMealDetailsFromText, transcribeAudio } from '../services/ai';

export class ProcessMeal {
  static async process({ fileKey }: { fileKey: string }) {
    const meal = await db.query.mealsTable.findFirst({
      where: eq(mealsTable.inputFileKey, fileKey),
    });

    console.log('meal:', meal);


    if (!meal) {
      throw new Error('Meal not found.');
    }

    if (meal.status === 'failed' || meal.status === 'success') {
      return;
    }

    await db
      .update(mealsTable)
      .set({ status: 'processing' })
      .where(eq(mealsTable.id, meal.id));

    try {

      let icon = '';
      let name = '';
      let foods = [];

      if (meal.inputType == 'audio') {

        const audioFileBuffer = await this.downloadAudioFile(meal.inputFileKey);

        const transcription = await transcribeAudio(audioFileBuffer)

        log('transcrição:', transcription);




        const mealDetails = await getMealDetailsFromText({
          createdAt: meal.createdAt,
          text: transcription,
        });

        log('detalhes da refeição:', mealDetails);

        icon = mealDetails.icon;
        name = mealDetails.name;
        foods = mealDetails.foods;
      }


      if (meal.inputType == 'picture') {

        const imageURL = await this.getImageUrl(meal.inputFileKey)


        const mealDetails = await getMealDetailsFromImage({
          createdAt: meal.createdAt,
          imageURL,
        })

        icon = mealDetails.icon;
        name = mealDetails.name;
        foods = mealDetails.foods;
      }

      await db
        .update(mealsTable)
        .set({
          status: 'success',
          name,
          icon,
          foods
        })
        .where(eq(mealsTable.id, meal.id));
    } catch {
      await db
        .update(mealsTable)
        .set({ status: 'failed' })
        .where(eq(mealsTable.id, meal.id));
    }
  }




  private static async getImageUrl(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    })



    return getSignedUrl(s3Client, command, { expiresIn: 600 })

  }

  private static async downloadAudioFile(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    })

    const { Body } = await s3Client.send(command);

    if (!Body || !(Body instanceof Readable)) {
      throw new Error('Cannot load the audio file');
    }

    const chunks = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }

    return (Buffer.concat(chunks))
  }
}