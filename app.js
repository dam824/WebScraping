const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');
const puppeteer = require('puppeteer');

//dependance pour forma xls

const json2xls = require('json2xls');
const fs = require('fs');
const XLSX = require('xlsx');


const baseUrl = "https://www.novagroupe.eu/poeles--1.html";
const totalPages = 5;

async function scrapeData(url){
    try {
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);

        //on stock les produits dans un array

        const links = [];

        $('.ann-titre h2 a').each((index, element) => {
            const href = $(element).attr('href');
            links.push(href);
        });

        console.log(links);

       return links
        
    }catch(error){
        console.log('une erreur est survenue :', error);
        return [];
    }
}




async function scrapeAllPages(){
    const allLinks = [];

    for(let i = 1; i <= totalPages; i++){
        const url = baseUrl + i + '.html';
        console.log(`Page ${i}: ${url}`);

        const links = await scrapeData(url);
        allLinks.push(...links);
    }

    console.log(allLinks);

     //conversion des données json en format excel

     /* const xls = json2xls(allLinks); */

     //ecriture du fichier excel

     /* fs.writeFileSync('Liens-poeles.xls', xls, 'binary');
     console.log("donnees exportees vers le fichier excel"); */
     // Conversion des données en format Excel
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(allLinks);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Liens');
  const excelFilePath = 'Liens-poeles.xlsx';
  XLSX.writeFile(workbook, excelFilePath);
  console.log(`Données exportées vers le fichier Excel : ${excelFilePath}`);
}

scrapeAllPages();

