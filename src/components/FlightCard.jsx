import { IconButton } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StraightIcon from '@mui/icons-material/Straight';
import { useState } from "react";
import dayjs from "dayjs";

export const FlightCard = ({ leg, flightClass, price, way }) => {

    const [toggleButton, setToggleButton] = useState(false)

    // Destination duration time fixer function.

    const timeFixer = (time) => {
        const hour = time / 60
        const checkInteger = Number.isInteger(hour)
        if (checkInteger === true) {
            return (
                <p>{hour} hours.</p>
            )
        } else {
            const integerPart = Math.floor(hour);
            const decimalPart = Number(hour % 1) * 60;
            
            return(
                <p>{integerPart} hours {Math.floor(decimalPart)} minutes.</p>
            )
        }
    }

    return (
        <div className="flightCardWrapper">
            <div className="flightCardContainer">
                <div className="leftSideDetails">
                    <img src={leg.carriers.marketing[0].logoUrl} alt="" />
                    {!toggleButton && <div className="details">
                        <p>{dayjs(leg.departure).format("HH:mm")} - {dayjs(leg.arrival).format("HH:mm")}</p>
                        <p>{leg.carriers.marketing.name}</p>
                    </div>}
                    {toggleButton && <div className="details">
                        <p>Departure | {dayjs(leg.departure).format("MM MMM ddd")}</p>
                    </div>}
                </div>
                <div className="midSideDetails">
                    <div className="details">
                        {timeFixer(leg.durationInMinutes)}
                        <p>{leg.origin.name}-{leg.destination.name}</p>
                    </div>
                    <p className="way">{leg.segments.length === 1 ? 'No Transfer' : `${leg.segments.length - 1} Transfers`}</p>
                </div>
                <div className="rightSideDetails">
                    <div className="details">
                        <p>{price}</p>
                        <p>{way}</p>
                    </div>
                    <IconButton onClick={() => setToggleButton(toggleButton ? false : true)}>
                        <KeyboardArrowDownIcon sx={{ color: '#ffffff', transform: toggleButton ? 'rotate(180deg)' : 'none', transition: '0.2s ease' }} />
                    </IconButton>
                </div>
            </div>
            {toggleButton && <div className="dropBoxContainer">
                <div className="flightDetails">
                    <StraightIcon sx={{ transform: 'rotate(180deg)', fontSize: '4em', color: '#ffffff' }} />
                    {leg.segments.length <= 1 && <div className="details">
                        <p>{dayjs(leg.departure).format("HH:mm")} | {leg.origin.name} {leg.origin.displayCode}</p>
                        <p>Travel Duration: {leg.durationInMinutes} minutes.</p>
                        <p>{dayjs(leg.arrival).format("HH:mm")} | {leg.segments[0].destination.name} {leg.segments[0].destination.displayCode}</p>
                    </div>}
                    {leg.segments.length > 1 && <div className="transferDetails">
                        <div className="details">
                            <p>{dayjs(leg.segments[0].departure).format("HH:mm")} | {leg.segments[0].origin.name} {leg.segments[0].origin.displayCode}</p>
                            <p>Travel Duration: {leg.segments[0].durationInMinutes} minutes.</p>
                            {leg.segments[0].durationInMinutes >= 60}
                            <p>{dayjs(leg.segments[0].arrival).format("HH:mm")} | {leg.segments[0].destination.name} {leg.segments[0].destination.displayCode}</p>
                        </div>
                        <hr />
                        <div className="details">
                            <p>{dayjs(leg.segments[1].departure).format("HH:mm")} | {leg.segments[1].origin.name} {leg.segments[1].origin.displayCode}</p>
                            <p>Travel Duration: {leg.segments[1].durationInMinutes} minutes.</p>
                            <p>{dayjs(leg.segments[1].arrival).format("HH:mm")} | {leg.segments[1].destination.name} {leg.segments[1].destination.displayCode}</p>
                        </div>
                        {leg.segments[2] && <hr />}
                        {leg.segments[2] && <div className="details">
                            <p>{dayjs(leg.segments[2].departure).format("HH:mm")} | {leg.segments[2].origin.name} {leg.segments[2].origin.displayCode}</p>
                            <p>Travel Duration: {leg.segments[1].durationInMinutes} minutes.</p>
                            <p>{dayjs(leg.segments[2].arrival).format("HH:mm")} | {leg.segments[2].destination.name} {leg.segments[2].destination.displayCode}</p>
                        </div>}
                        {leg.segments[3] && <hr />}
                        {leg.segments[3] && <div className="details">
                            <p>{dayjs(leg.segments[3].departure).format("HH:mm")} | {leg.segments[3].origin.name} {leg.segments[3].origin.displayCode}</p>
                            <p>Travel Duration: {leg.segments[1].durationInMinutes} minutes.</p>
                            <p>{dayjs(leg.segments[3].arrival).format("HH:mm")} | {leg.segments[3].destination.name} {leg.segments[3].destination.displayCode}</p>
                        </div>}
                    </div>}
                </div>
                <div className="extraDetails">
                    <p>
                        {leg.carriers.marketing[0].name} {flightClass}.
                    </p>
                </div>
            </div>}
        </div>
    )
}