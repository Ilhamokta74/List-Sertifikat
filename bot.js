const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { finished } = require('stream');

// URL dari halaman yang ingin di-scrape
const url = 'https://www.dicoding.com/academies/list';

async function scrapeCourseCards() {
    try {
        // Lakukan permintaan HTTP GET ke halaman tersebut
        const { data } = await axios.get(url);

        // Muat HTML ke cheerio untuk manipulasi DOM
        const $ = cheerio.load(data);

        // Array untuk menyimpan data yang di-scrape
        const courses = [];

                // Ambil semua tag <a> dengan class "course-card course-card--with-logo"
                $('a.course-card.course-card--with-logo').each((i, element) => {
                    const courseHref = $(element).attr('href'); // Mendapatkan atribut href
                    const courseLabel = $(element).attr('data-event-label'); // Mendapatkan atribut data-event-label
                    
                    // Cari tag <img> di dalam elemen <a>
                    const imgElement = $(element).find('img.course-card__logo');
                    const imgSrc = imgElement.attr('src'); // Mendapatkan atribut src dari <img>
                    const imgDataOriginal = imgElement.attr('data-original'); // Mendapatkan atribut data-original dari <img>
        
                    // Tambahkan data ke array
                    courses.push({
                        url: courseHref,
                        label: courseLabel,
                        imageUrl: imgDataOriginal,
                        finished: false
                    });
                });

        // Simpan data ke file JSON
        fs.writeFileSync('./data/Data.json', JSON.stringify(courses, null, 2));

        console.log('Data berhasil disimpan ke Data.json');
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Jalankan fungsi scraping
scrapeCourseCards();
