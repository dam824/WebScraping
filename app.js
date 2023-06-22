const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');

//dependance pour forma xls

const json2xls = require('json2xls');
const fs = require('fs');

const baseUrl = "https://www.novagroupe.eu/poeles--1.html";

async function scrapeData(url){
    try {
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);

        //on stock les produits dans un array

        const products = [];

        $('.ann-titre h2').each((index, element) => {
            /* console.log($(element).text()); */
            const productTitle = $(element).text();
            products.push({'Product Title' : productTitle});
        });

        console.log(products);

       return products
        
    }catch(error){
        console.log('une erreur est survenue :', error);
        return [];
    }
}

async function scrapeAllPages(){
    const allProducts = [];

    for(let i = 1; i <= 5; i++){
        const url = `${baseUrl}?page=${i}`;
        console.log(`Page ${i}: ${url}`);

        const products = await scrapeData(url);
        allProducts.push(...products);
    }

     //conversion des données json en format excel

     const xls = json2xls(allProducts);

     //ecriture du fichier excel

     fs.writeFileSync('Poeles-a-bois.xls', xls, 'binary');
     console.log("donnees exportees vers le fichier excel");
}

scrapeAllPages();

scrapeData();