import { useEffect, useState } from 'react';
import './styles.css'
import 'boxicons'
import { toast } from 'sonner';

const MatchCard = (props) => {

    const {match, matchList, setMatchList, setPlayerList} = props;
    const {team1, team2, groupKey} = match;
    const [match_winners, setWinners] = useState("");
    const team1Names = team1.map(item => item.name)
    const team2Names = team2.map(item => item.name)
    const [matchStatusLabel, setMatchStatusLabel] = useState("Match Ongoing");
    

    const handleMatchDone = () => {
        if (match_winners) {
            // convert winners to list of winners
            let winnerList = []
            let loserList = []
            if (match_winners === "Team 1") {
                winnerList = team1Names
                loserList = team2Names
            } else if (match_winners === "Team 2") {
                winnerList = team2Names
                loserList = team1Names
            }

            setMatchList(prevList => 
                prevList.map(match => {
                    if (match.groupKey === groupKey) {
                        return {...match, matchStatus: 1, winners: winnerList, match_winners: match_winners, losers: loserList}
                    } else return match
                }))
            
            setToBeReleased([...team1Names, ...team2Names]);
            setLastGamePlayed([...team1Names, ...team2Names])
            toast.success("Match Recorded")
            
            
        } else toast.error("No winners Selected.", {
            description:"Please select winning team"
        })
    }
    
    const handleMatchCancel = () => {
        setMatchList(prevList => 
            prevList.map((match) => {
                if (match.groupKey === groupKey) {
                    return {...match, matchStatus: -1, match_winners: '', winners: [], losers: []}
                } else return match
            }))
        setToBeReleased([...team1Names, ...team2Names])
        toast.success("Match Cancelled")
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

    const setLastGamePlayed = (names) => {
            setPlayerList(prevList => prevList.map((player) => {
                    if (names.includes(player.name)) {
                        const timestamp = Date.now()
                        return {...player, 
                            lastGame: new Date(timestamp).toLocaleTimeString()}
                    } else return player
                }));
        }
    const getMatchLabel = (matchStatus, winners) => {
        if(matchStatus === -1) return "Cancelled" 
        if(matchStatus === 0) return "" 
        if(matchStatus === 1) return "Recorded"
                    
    }

    useEffect(() => {
        const currentMatch = matchList.find(match => match.groupKey === groupKey)
        setMatchStatusLabel(getMatchLabel(currentMatch.matchStatus, currentMatch.winners))
 
    }, [matchList])

    useEffect(() => {
        const currentMatch = matchList.find(match => match.groupKey === groupKey)
        setWinners(currentMatch.match_winners)
    }, [match])

    return (
        <div className='MatchCard'>
            <div className="radio-group">
                {match.matchStatus !==0 ? 
                    <h1 className={'matchStatus' + (match.matchStatus===-1 ? " cancelled": " recorded")}>{matchStatusLabel}</h1> 
                : ""}
                <input 
                className='radio__input'
                type="radio" 
                name={groupKey} 
                id={groupKey + 'radio1'}
                value="Team 1"
                checked={match_winners==="Team 1"}
                onChange={handleRadioChange}
                disabled={match.matchStatus !== 0}/>
                <label className='radio__label' htmlFor={groupKey + 'radio1'}>
                    {match_winners==="Team 1" ? 
                    <box-icon name='medal'></box-icon>
                    : ''}
                    <strong>Team 1</strong>
                    {team1Names && team1Names.map((player, index) => 
                    <p key={index}>{player}</p>)}
                </label>

                <input 
                className='radio__input'
                type="radio" 
                name={groupKey} 
                id={groupKey + 'radio2'}
                value="Team 2"
                checked={match_winners==="Team 2"}
                onChange={handleRadioChange}
                disabled={match.matchStatus !== 0}/>
                <label className='radio__label' htmlFor={groupKey + 'radio2'}>
                    {match_winners==="Team 2" ? 
                        <box-icon name='medal'></box-icon>
                        : ''}
                    <strong>Team 2</strong>
                    {team2Names && team2Names.map((player, index) => 
                    <p key={index}>{player}</p>)}
                </label>

            </div>

            <div className="button-group">
                <button 
                    className='done-button' 
                    onClick={handleMatchDone}
                    disabled={match.matchStatus !== 0}>
                        <box-icon className='check' name='check-circle'></box-icon>
                    </button>
                <button 
                    className='cancel-button' 
                    onClick={handleMatchCancel}
                    disabled={match.matchStatus !== 0}>
                        <box-icon className='cancel' name='x-circle' ></box-icon>
                    </button>
            </div>    

        </div>
    )
}; export default MatchCard;