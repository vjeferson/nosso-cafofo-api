
import { Request, Response } from 'express';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import UtilsSerive from '../../utils/utils-service';
import { Assinatura } from '../assinatura/assinatura-model';
import { mapTiposPlanos } from '../../utils/consts';

export default class RelatoriosController {

  async assinantes(request: Request, response: Response): Promise<Response> {
    try {

      const query = Assinatura.query().alias('a');
      const assinantes = await query.select(
        'a.id',
        'a.ativa',
        'r.nome',
        'r.anoCriacao',
        'p.tipoPlano'
      )
        .joinRelated('republica', { alias: 'r' })
        .joinRelated('plano', { alias: 'p' })
        .orderBy('a.id', 'ASC');

      const fonts = {
        Helvetica: {
          normal: "Helvetica",
          bold: "Helvetica-Bold",
          italics: "Helvetica-Oblique",
        }
      };


      const bodyInfo: any[] = new Array();
      for (let assinante of assinantes) {
        const row = [
          assinante.id,
          assinante.ativa ? 'Ativo' : 'Desativo',
          (assinante as any).nome,
          (assinante as any).anoCriacao,
          mapTiposPlanos[+(assinante as any).tipoPlano]
        ];
        bodyInfo.push(row);
      }

      const docDefinition: TDocumentDefinitions = {
        defaultStyle: { font: "Helvetica" },
        content: [
          {
            text: 'Relatório de Assinantes',
            style: 'header',
            alignment: 'center'
          },
          {
            table: {
              widths: [50, 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Id', style: 'columnTitle' },
                  { text: 'Situação', style: 'columnTitle' },
                  { text: 'Nome República', style: 'columnTitle' },
                  { text: 'Ano de Criação', style: 'columnTitle' },
                  { text: 'Tipo de Plano', style: 'columnTitle' }
                ],
                ...bodyInfo
              ],
            }
          }
        ],
        footer: {
          columns: [
            { text: 'Nosso Cafofo', alignment: 'left', style: 'footer', },
            {
              text: new Date().toLocaleDateString('pt-br',
                {
                  second: ('numeric' || '2-digit'),
                  minute: ('numeric' || '2-digit'),
                  hour: ('numeric' || '2-digit'),
                  timeZone: 'America/Sao_Paulo',
                  hour12: false
                }
              ), alignment: 'right', style: 'footer',
            }
          ]
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'justify',
            lineHeight: 2
          },
          columnTitle: {
            fontSize: 14,
            bold: true
          },
          footer: {
            fontSize: 12,
            lineHeight: 2,
            margin: [40, 0]
          }
        }
      };

      const name = `relatorio-assinantes-${new Date().getMilliseconds()}.pdf`;
      const url = await gerarPdfRelatorio(docDefinition, fonts, name);

      return response.status(200).send({url});

    } catch (error:any) {
      return response.status(400).send("Erro ao realizar a impressão: "+ error.message);
    }

  }

}

export async function gerarPdfRelatorio(docDefinition: TDocumentDefinitions, fonts: any, name:string) {
  return new Promise((resolve, reject) => {

    try {
      const printer = new PdfPrinter(fonts);
      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      const chunks: any = [];
      let result: Buffer;

      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', async function () {
        result = Buffer.concat(chunks);
        const bucket = 'nosso-cafofo-public/reports';
        const url = await UtilsSerive.sendFileS3(result, name, bucket);
        resolve(url);
      });

      pdfDoc.end();

    } catch (err) {
      reject(err);
    }

  });
}