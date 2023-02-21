import request from 'request';
import * as cheerio from 'cheerio';
import express, { json } from 'express';
import puppeteer from 'puppeteer';
import { insertCafeInfo } from '../service/cafeService.js'
const app = express();
import pool from '../config/database.js';

export const starBucks = async (req,res ) => {
    try {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  
    await page.goto('https://www.starbucks.co.kr/store/store_map.do?disp=locale');
  
    // 서울 버튼 클릭
    await page.waitForSelector('#container > div > form > fieldset > div > section > article.find_store_cont > article > article:nth-child(4) > div.loca_step1 > div.loca_step1_cont > ul > li:nth-child(1) > a');
    await page.click('#container > div > form > fieldset > div > section > article.find_store_cont > article > article:nth-child(4) > div.loca_step1 > div.loca_step1_cont > ul > li:nth-child(1) > a');

    await new Promise(resolve => setTimeout(resolve, 1000)); // waits for 1 second


    // 전체 버튼 클릭
    await page.waitForSelector('#mCSB_2_container > ul > li:nth-child(1) > a');
    await page.click('#mCSB_2_container > ul > li:nth-child(1) > a');

    await new Promise(resolve => setTimeout(resolve, 1000)); // waits for 1 second


    // HTML 가져오기
    const html = await page.content();


    // Cheerio를 사용하여 매장 정보 추출
    const $ = cheerio.load(html);


    const Info = $('#mCSB_3_container > ul > li').map((_, el) => {
    const name = $(el).data('name');
    const lat = $(el).data('lat');
    const lng = $(el).data('long');
    const address = $(el).find('.result_details').text().trim();
    //전화번호 찾기.
    const number = address.match(/\d{4}-\d{4}/)[0];

    return  { name, address, number, lat, lng };

    }).get();
    
    for (var i = 0 ; i < Info.length ; i++ ){
        const myName = Info[i].name
        const myLat = Info[i].lat
        const myLng = Info[i].lng
        const myAddress = Info[i].address
        const myNumber = Info[i].number


        await insertCafeInfo(myName,myLat,myLng,myAddress,myNumber);

    }
    

    } catch(err) {

        console.log(err);
    }

};



export const getCafe = async(req,res) => {
    try {


        const conn = await pool.getConnection(async conn => conn);
        const getLatLngSql = `SELECT lat, lng, name, address FROM CafeInfo`;

        const [result] = await conn.query(getLatLngSql);
        
 


        return res.render('cafe', { result })


      } catch (error) {
        console.error(error);
      }
}
