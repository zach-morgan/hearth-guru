import axios from 'axios';
const fs = require('fs').promises;


const BASE_URL = 'https://hearthstone.blizzard.com/en-us/api/community/leaderboardsData';

const processNewLeaderBoardData = async () => {
    let currentPage = 1;
    let lastPage = 150;

    let leaderboardData = [];

    for (currentPage; currentPage <= lastPage; currentPage++) {
        let apiURL = BASE_URL + `?region=US&leaderboardId=arena&page=${currentPage}`;
        try {
            let response = await axios.get(apiURL);
    
            // let lastPage = response.data.leaderboard.pagination.totalPages;
    
            const leaderboard = response.data.leaderboard.rows;
            console.log(leaderboard[0].rank)
            leaderboardData = leaderboardData.concat(leaderboard);
    
            await delay(200)
        } catch(err) {
            console.log(`Error page ${currentPage}: ${err}`);
        }
    }

    let obj = {};
    leaderboardData.forEach((item: any) => {
        if (obj[item.accountid]) {
            obj[item.accountid]++;
            console.log("DUPLICATE ", item.accountid)
        }
        else
            obj[item.accountid] = 1;
    })

    let jsonData = JSON.stringify({
        leaderboardData,
        obj
    }, null, 2);
    await fs.writeFile('src/scripts/leaderboard.json', jsonData);
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


processNewLeaderBoardData();