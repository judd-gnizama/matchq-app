import { useEffect, useState } from 'react';
import './styles.css'

const MatchCard = (props) => {

    const {match, matchList, setMatchList, setPlayerList} = props;
    const {team1, team2, groupKey} = match;
    const [winners, setWinners] = useState("");
    const team1Names = team1.map(item => item.name)
    const team2Names = team2.map(item => item.name)
    const [matchStatusLabel, setMatchStatusLabel] = useState("Match Ongoing");
    

    const handleMatchDone = () => {
        if (winners) {
            // convert winners to list of winners
            let winnerList = []
            let loserList = []
            if (winners === "Team 1") {
                winnerList = team1Names
                loserList = team2Names
            } else if (winners === "Team 2") {
                winnerList = team2Names
                loserList = team1Names
            } else winnerList = []

            setMatchList(prevList => 
                prevList.map(match => {
                    if (match.groupKey === groupKey) {
                        return {...match, matchStatus: 1, winners: winnerList, losers: loserList}
                    } else return match
                }))
            setToBeReleased([...team1Names, ...team2Names]);
            
            
        } else console.log("No winners Selected")
    }
    
    const handleMatchCancel = () => {
        setMatchList(prevList => 
            prevList.map((match) => {
                if (match.groupKey === groupKey) {
                    return {...match, matchStatus: -1, winners: [], losers: []}
                } else return match
            }))
        setToBeReleased([...team1Names, ...team2Names])
    }

    const handleRadioChange = (event) => {
        setWinners(event.target.value)
    }

    const setToBeReleased = (names) => {
        setPlayerList(prevList => prevList.map((player) => {
                if (names.includes(player.name)) {
                    return {...player, toBeReleased: true}
                } else return player
            }));
    }

    const getMatchLabel = (matchStatus, winners) => {
        if(matchStatus === -1) return "Match Cancelled" 
        if(matchStatus === 0) return "Match Ongoing" 
        if(matchStatus === 1) {
            return (<div>
                        Winner!
                        {winners.map((player, index) => <p key={index}>{player}</p>)}
                    </div>)
        }
                    
    }

    useEffect(() => {
        const currentMatch = matchList.find(match => match.groupKey === groupKey)
        setMatchStatusLabel(getMatchLabel(currentMatch.matchStatus, currentMatch.winners))
    }, [matchList])



    return (
        <div className='MatchCard'>
            <label>{matchStatusLabel}</label>
            <label>
                <input 
                type="radio" 
                name={groupKey} 
                value="Team 1"
                checked={winners==="Team 1"}
                onChange={handleRadioChange}
                disabled={match.matchStatus !== 0}/>
                <div>
                    <strong>Team 1</strong>
                    {team1Names && team1Names.map((player, index) => 
                    <p key={index}>{player}</p>)}
                </div>

            </label>
            <label>

                <input 
                type="radio" 
                name={groupKey} 
                value="Team 2"
                checked={winners==="Team 2"}
                onChange={handleRadioChange}
                disabled={match.matchStatus !== 0}/>
                <div>
                    <strong>Team 2</strong>
                    {team2Names && team2Names.map((player, index) => 
                    <p key={index}>{player}</p>)}
                </div>
                
            </label>
            <button 
                className='done-button' 
                onClick={handleMatchDone}
                disabled={match.matchStatus !== 0}>Done</button>
            <button 
                className='cancel-button' 
                onClick={handleMatchCancel}
                disabled={match.matchStatus !== 0}>Cancel</button>

        </div>
    )
}; export default MatchCard;