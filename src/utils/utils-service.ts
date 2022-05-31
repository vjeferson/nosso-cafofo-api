import {AWS} from './consts';

export default class UtilsSerive {

    constructor() {};

    static gerarCodigoRecuperacaoSenha(): string {
        return Math.random().toString(36).slice(-8);
    }

    static async sendFileS3(buffer:any, name:string, bucket: string): Promise<string> {
        const s3 = new AWS.S3(this.createConnectionString());

        const data = {
            Bucket: bucket,
            Key: name,
            Body: buffer
        };

        try {
            await s3.putObject(data).promise();
        } catch(error) {
            throw new Error('Erro ao fazer upload do arquivo: ' + error);
        }

        return await this.getFileUrlS3({ 
            Bucket: data.Bucket, 
            Key: data.Key, 
            Expires: 10 
        }, s3);
    }

    static async getFileUrlS3(awsS3Model:any, s3:any): Promise<string> {
        let fileUrl = '';

        try {
            fileUrl = await s3.getSignedUrlPromise('getObject', awsS3Model);
        } catch (ex) {
            console.log(ex)
        }

        return fileUrl;
    }

    private static createConnectionString () {
        console.log({
            region: process.env.AWS_DEFAULT_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        })
        return {
            region: process.env.AWS_DEFAULT_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        };
    }  

}