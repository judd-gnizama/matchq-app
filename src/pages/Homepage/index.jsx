import Header from "../../components/Header";
import QueueingPage from "../QueueingPage";
import InProgressPage from "../InProgressPage";
import { useEffect, useState } from "react";

const Homepage = () => {

    const LOCALSTORAGEKEY_PLAYER = 'player'
    const LOCALSTORAGEKEY_MATCH = 'match'

    const [playerList, setPlayerList] = useState([]);
    const [matchList, setMatchList] = useState([]);

    const getDataFromQueueing = (getNewMatch) => {
        if (getNewMatch) {

            const prevList = [...matchList, getNewMatch]
            const sortedMatchList = prevList.sort((a, b) => b.groupKey - a.groupKey)
            setMatchList(sortedMatchList)
        }
    }

    const countOccurrences = (array, itemToFind) => {
        let count = 0
        array.forEach(item => {
            if (item === itemToFind) count++ 
        })
        return count
    }

    const sortPlayerList = (prevList) => {
        const sortedPlayerList = prevList.sort((a, b) => a.gamesPlayed - b.gamesPlayed)
        setPlayerList(sortedPlayerList);
    }

    useEffect(() => {
    
        // check all matches not ongoing 
        const idleMatches = matchList.filter(match => 
            match.matchStatus !== 0)
        let idleWins = []
        let idleLosses = []
        for (let i=0; i < idleMatches.length; i++) {
            if (idleMatches[i].winners && idleMatches[i].losers) {
                idleWins = [...idleWins, ...idleMatches[i].winners]
                idleLosses = [...idleLosses, ...idleMatches[i].losers]
            }
        }

        // update player status
        const prevList = 
            playerList.map((player) => {
                if (player.toBeReleased) {
                    const n_wins = countOccurrences(idleWins, player.name)
                    const n_losses = countOccurrences(idleLosses, player.name)
                    return {...player, 
                        playerStatus: "idle", 
                        wins: n_wins,
                        losses: n_losses,
                        gamesPlayed: n_wins + n_losses,
                        currentTeam: "N/A",
                        toBeReleased: false
                    }
                } else return player;
            })
        
        sortPlayerList(prevList)

    }, [matchList])

    // Local Storage

    useEffect(() => {
        const storedPlayerList = localStorage.getItem(LOCALSTORAGEKEY_PLAYER);
        if (storedPlayerList) {
            setPlayerList(JSON.parse(storedPlayerList))
            console.log("Loaded")
        }
        const storedMatchList = localStorage.getItem(LOCALSTORAGEKEY_MATCH);
        if (storedMatchList) {
            setMatchList(JSON.parse(storedMatchList))
            console.log("Loaded Match")
        }
    }, [])

    useEffect(() => {
        if(playerList.length > 0) {
            localStorage.setItem(LOCALSTORAGEKEY_PLAYER, JSON.stringify(playerList))
            console.log("Saved Player")
        } 

    }, [playerList])
    useEffect(() => {
        if(matchList.length > 0){
            localStorage.setItem(LOCALSTORAGEKEY_MATCH, JSON.stringify(matchList))
            console.log("Saved Match")
        }
    }, [matchList])

    return (
        <div className="Homepage">
            <Header/>
            <QueueingPage 
                playerList={playerList} 
                setPlayerList={setPlayerList} 
                setMatchList={setMatchList}
                getDataFromQueueing={getDataFromQueueing}
                sortPlayerList={sortPlayerList}
                playerKey={LOCALSTORAGEKEY_PLAYER}
                matchKey={LOCALSTORAGEKEY_MATCH}/>
            
            {playerList.length > 0 && matchList.length > 0 ? 
                <InProgressPage 
                matchList={matchList}
                setMatchList={setMatchList} 
                setPlayerList={setPlayerList} 
                />
            : ''}
            
            
        </div>
    )
}; export default Homepage;