import { firebase,firebaseAuth,firebaseDb } from 'src/boot/firebase'
import { _ } from 'src/boot/axios'
import { Dialog } from 'quasar'

// game notifs
export async function addGameNotification ({rootState},payload) {

    //Selected Game Data Store
    let selectedGameData = rootState.gameNotifications.selectedGameData
    let {gameCategory,gameKey,scheduleKey,teamBlue,teamRed,gameNumber} = selectedGameData
    let gameMatchUp = `${teamBlue.team} VS ${teamRed.team}`
    let teamWinner = payload.teamWinnerColor == 'RED' ? teamRed.team: teamBlue.team
    // STATUS, ifOptions , teamWinnerColor , teamWinner (STRING)
    // betOptionsKey
    
    let ifOptions = payload.ifOptions || null
    let betOptions = null
    let betOptionsName = ''
    if(ifOptions){
        betOptions = {...payload.selectedOptions}
        betOptionsName = betOptions.name
    }
     

    console.log(betOptions,'selectedOptions')



    //  GAME KEY ,  SCHEDULE KEY , GAMECATEGORY STRING 
    // GAME NUMBER , GAME MATCHUP (RED VS BLUE) 


    // TAG , MESSAGE , TIMESTAMP 



    
    let message = ''
    if(payload.status == 'OPEN'){
        message = 'Betting is RE-OPENED.'
    } else if(payload.status == 'CLOSED'){
        message = 'Betting is now CLOSED.'
    } else if(payload.status == 'CANCELLED'){
        message = 'CANCELLED BETS due to low odds. Please wait for the credit refunds.'
    } else if(payload.status == 'ENDGAME'){
        message = ifOptions ? `${teamWinner} (${payload.teamWinnerColor}) WINS! - ${betOptionsName}`: `GAME ENDED. ${teamWinner} (${payload.teamWinnerColor}) WINS!`
    }

    let tag = ifOptions ? betOptionsName : 'MAIN MATCH'

    let gameNotification = {
        tag,
        gameMatchUp,
        gameCategory,
        gameKey,
        betOptionsKey: ifOptions ? betOptions['.key'] : null,
        scheduleKey,
        gameNumber,
        message,
        timestamp: new Date(),
        ifOptions: payload.ifOptions,
        teamWinnerColor: payload.teamWinnerColor ? payload.teamWinnerColor : null,
        status: payload.status
    }

    console.log(gameNotification,'gameNotification (STORE)')

    await saveLiveGameNotifications(gameNotification);

}

// player related - game notifs
export async function addGamePlayerNotification ({rootState},payload) {

    //Selected Game Data Store
    let selectedGameData = rootState.gameNotifications.selectedGameData
    let {gameCategory,gameKey,scheduleKey,teamBlue,teamRed,gameNumber} = selectedGameData
    let gameMatchUp = `${teamBlue.team} VS ${teamRed.team}`
    let teamWinner = payload.teamWinnerColor && payload.teamWinnerColor == 'RED' ? teamRed.team: teamBlue.team
    let ifOptions = payload.ifOptions || null
    let betOptions = null
    let betOptionsName = ''
    if(ifOptions){
        betOptions = {...payload.selectedOptions}
        betOptionsName = betOptions.name
    }

    let message = ''
    if(payload.status == 'WIN'){
        message = `You have won ₱ ${payload.amount} and it is already credited in your account.`
    } else if(payload.status == 'LOSE'){
        message = 'Sorry, better luck next game. Stay tune for the next live game.'
    } else if(payload.status == 'REFUNDED'){
        message = `Your cancelled bets with an amount of ₱ ${payload.amount} is now refunded to your account.`
    } 

    let tag = ifOptions ? betOptionsName : 'MAIN MATCH'


    let gameNotification = {
        tag,
        gameMatchUp,
        gameCategory,
        gameKey,
        playerKey: payload.playerKey,
        amount: payload.amount,
        betOptionsKey: ifOptions ? betOptions['.key'] : null,
        scheduleKey,
        gameNumber,
        message,
        teamWinner,
        timestamp: new Date(),
        ifOptions: payload.ifOptions,
        teamWinnerColor: payload.teamWinnerColor ? payload.teamWinnerColor : null,
        status: payload.status
    }

    console.log(gameNotification,'PlayerGameNotifications (STORE)')

    await savePlayerGameNotifications(gameNotification);
}

// game notifs FUNCTIONS
async function saveLiveGameNotifications(gameNotifs){
    try {
        const response = await firebaseDb.collection('LiveGameNotifications').add(gameNotifs);
        if(response) { console.log('%c SUCCESS_GAMENOTIFS','background: #222; color: #bada55') }
    } catch (error) {
        console.log(error,'error')
        console.log('%c ERROR_GAMENOTIFS','background: #D50000; color: #fff')
    }   
}

// game notifs FUNCTIONS
async function savePlayerGameNotifications(gameNotifs){
    try {
        const response = await firebaseDb.collection('PlayerLiveGameNotifications').add(gameNotifs);
        if(response) { console.log('%c SUCCESS_PLAYERGAMENOTIFS','background: #222; color: #bada55') }
    } catch (error) {
        console.log(error,'error')
        console.log('%c ERROR_PLAYERGAMENOTIFS','background: #D50000; color: #fff')
    }   
}