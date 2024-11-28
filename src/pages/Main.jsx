import { useState } from "react"
import { SearchBar } from "../components/SearchBar"
import { FlightCard } from "../components/FlightCard"
import { Svg } from "../components/Svg"
import { NoFoundSvg } from "../components/NoFoundSvg"

export const Main = () => {

    const [way, setWay] = useState('Two Way')
    const [flightClass, setFlightClass] = useState('Economy')
    const [departureDate, setDepartureDate] = useState()
    const [returnDate, setReturnDate] = useState()
    const [flights, setFlights] = useState()

    return (
        <div className="wrapper">
            <Svg />
            <h1>Spotter Flights</h1>
            <SearchBar way={way} setWay={setWay} flightClass={flightClass} setFlightClass={setFlightClass} departureDate={departureDate}
                setDepartureDate={setDepartureDate} returnDate={returnDate} setReturnDate={setReturnDate} setFlights={setFlights} />
            <div className="flightsWrapper">
                {flights && flights.map((flight, key) => (
                    <FlightCard key={key} price={flight.price.formatted} way={way} leg={flight.legs[0]} flightClass={flightClass} />
                ))}
                {flights && flights.length === 0 && <div className="noFlightsFound">
                    <NoFoundSvg />
                    <p>Sorry! We couldn't find any flights.</p>
                </div>}
            </div>
        </div>
    )
}