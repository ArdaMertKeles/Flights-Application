import * as React from 'react';
import { useState, useRef } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Select, MenuItem, Popover, Button, Box, Typography, IconButton, TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDispatch, useSelector } from "react-redux";
import { setOriginSkyId, incrementAdults, decrementAdults, incrementChildren, decrementChildren, incrementInfants, decrementInfants, setDepartureValue, setOriginEntityId } from "../features/flightParamsChecker"

export const SearchBar = ({ setFlightStatus, way, setWay, flightClass, setFlightClass, returnDate, setReturnDate, departureDate, setDepartureDate, setFlights }) => {

    // States

    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [secLoading, setSecLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [originInput, setOriginInput] = useState('');
    const [originPossibles, setOriginPossibles] = useState([]);
    const [destinationInput, setDestinationInput] = useState('');
    const [destinationPossibles, setDestinationPossibles] = useState([]);
    const [destinationID, setDestinationID] = useState('')
    const [destinationEntityID, setDestinationEntityID] = useState('')
    const [returnValue, setReturnValue] = useState()
    const [flightClassValue, setFlightClassValue] = useState('economy')

    const apiKey = process.env.REACT_APP_API_KEY
    const debounceTimeoutRef = useRef(null);
    const dispatch = useDispatch()

    // Redux variables

    const originSkyId = useSelector((state) => state.flightParamsCheck.originSkyIdValue)
    const originEntityId = useSelector((state) => state.flightParamsCheck.originEntityIdValue)
    const departureValue = useSelector((state) => state.flightParamsCheck.departureValue)
    const adults = useSelector((state) => state.flightParamsCheck.adultsValue)
    const children = useSelector((state) => state.flightParamsCheck.childrenValue)
    const infants = useSelector((state) => state.flightParamsCheck.infantsValue)

    // Autocomplete rendering request function

    const searchAirport = async (query, setPossibles, setLoadingChecker) => {
        if (!query) return;
        setLoadingChecker(true);
        try {
            const options = {
                method: 'GET',
                url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
                params: { query },
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
                }
            };
            const response = await axios.request(options);
            const airports = response.data.data.slice(0, 5);
            setPossibles(airports);
        } catch (error) {
            console.error("Error fetching airports:", error);
        } finally {
            setLoadingChecker(false);
        }
    };

    // Passengers selection anchor

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Autocomplete inputchange function

    const handleInputChange = (newInputValue, setInputValue, setPossibles, setLoadingChecker) => {
        setInputValue(newInputValue);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            searchAirport(newInputValue.toLowerCase(), setPossibles, setLoadingChecker);
        }, 300);
    };

    // Search flights function

    const searchFlights = async () => {
        setSearchLoading(true)
        const options = {
            method: 'GET',
            url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
            params: {
                originSkyId: originSkyId,
                destinationSkyId: destinationID,
                originEntityId: originEntityId,
                destinationEntityId: destinationEntityID,
                date: departureValue,
                returnDate: returnValue,
                cabinClass: flightClassValue,
                adults: adults,
                children: children,
                infants: infants,
                sortBy: 'best',
            },
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
            }
        };

        try {
            const {data} = await axios.request(options);
            setFlightStatus(data.status)
            setFlights(data?.data?.itineraries.slice(0, 10));
        } catch (error) {
            console.error(error);
        } finally {
            setSearchLoading(false)
        }
    }

    return (
        <div className='searchBarContainer'>
            <div className="detailsContainer">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={way}
                    onChange={(e) => setWay(e.target.value)}
                    size='small'
                    sx={{ m: 1, color: '#C2C6CA' }}
                    variant='standard'
                    className='select'
                >
                    <MenuItem value={'One Way'}>One Way</MenuItem>
                    <MenuItem value={'Two Way'}>Two Way</MenuItem>
                </Select>
                <Button
                    aria-describedby={id}
                    variant="standart"
                    onClick={handleClick}
                    sx={{ fontSize: '1em', display: 'flex', gap: '1px', color: '#C2C6CA' }}
                >
                    <PersonIcon /> {adults + children + infants}
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                    }}
                >
                    <Box p={2} sx={{ width: "200px" }}>
                        <Box display="flex" justifyContent="space-between" alignItems='center' mt={1}>
                            <Typography>Adults</Typography>
                            <div>
                                <IconButton onClick={adults !== 1 ? () => dispatch(decrementAdults()) : null} >
                                    <RemoveIcon />
                                </IconButton>
                                {adults}
                                <IconButton onClick={() => dispatch(incrementAdults())} >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems='center' mt={1}>
                            <Typography>Children</Typography>
                            <div>
                                <IconButton onClick={children !== 0 ? () => dispatch(decrementChildren()) : null} >
                                    <RemoveIcon />
                                </IconButton>
                                {children}
                                <IconButton onClick={() => dispatch(incrementChildren())} >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems='center' mt={1}>
                            <Typography>Infants</Typography>
                            <div>
                                <IconButton onClick={infants !== 0 ? () => dispatch(decrementInfants) : null}>
                                    <RemoveIcon />
                                </IconButton>
                                {infants}
                                <IconButton onClick={() => dispatch(incrementInfants())}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </Box>
                    </Box>
                </Popover>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={flightClass}
                    onChange={(e) => setFlightClass(e.target.value)}
                    size='small'
                    sx={{ m: 1, color: '#C2C6CA' }}
                    variant='standard'
                    className='select'
                >
                    <MenuItem onClick={() => setFlightClassValue('economy')} value={'Economy'}>Economy</MenuItem>
                    <MenuItem onClick={() => setFlightClassValue('premium_economy')} value={'Premium Economy'}>Premium Economy</MenuItem>
                    <MenuItem onClick={() => setFlightClassValue('business')} value={'Business Class'}>Business Class</MenuItem>
                    <MenuItem onClick={() => setFlightClassValue('first')} value={'First Class'}>First Class</MenuItem>
                </Select>
            </div>
            <div className="additionContainer">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='autoCompleteContainer'>
                        <Autocomplete
                            sx={{
                                width: '45%', "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "gray"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#C2C6CA"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#C2C6CA"
                                    }
                                }
                            }}
                            className='autoComplete'
                            options={originPossibles}
                            getOptionLabel={(option) => option.presentation.suggestionTitle || ''}
                            inputValue={originInput}
                            onInputChange={(e, newValue) => handleInputChange(newValue, setOriginInput, setOriginPossibles, setLoading)}
                            onChange={(e, option) => {
                                if (option) {
                                    dispatch(setOriginEntityId(option.entityId));
                                    dispatch(setOriginSkyId(option.skyId));
                                } else {
                                    dispatch(setOriginEntityId(''));
                                    dispatch(setOriginSkyId(''));
                                }
                            }}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Origin"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputLabel-root': { color: '#C2C6CA' },
                                        "& .MuiOutlinedInput-input": { color: "#C2C6CA" },
                                    }}
                                />
                            )}
                        />
                        <Autocomplete
                            sx={{
                                width: '45%', "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "gray"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#C2C6CA"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#C2C6CA"
                                    }
                                }
                            }}
                            className='autoComplete'
                            options={destinationPossibles}
                            getOptionLabel={(option) => option.presentation.suggestionTitle || ''}
                            inputValue={destinationInput}
                            onInputChange={(e, newValue) =>
                                handleInputChange(newValue, setDestinationInput, setDestinationPossibles, setSecLoading)}
                            onChange={(e, option) => {
                                if (option) {
                                    setDestinationEntityID(option.entityId);
                                    setDestinationID(option.skyId);
                                } else {
                                    setDestinationEntityID('');
                                    setDestinationID('');
                                }
                            }}
                            loading={secLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Destination"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputLabel-root': { color: '#C2C6CA' },
                                        "& .MuiOutlinedInput-input": { color: "#C2C6CA" }
                                    }}
                                />
                            )}
                        />
                    </div>
                    <DatePicker format='YYYY/MM/DD' className='datePicker' disablePast value={departureDate} onChange={(newValue) => { dispatch(setDepartureValue(newValue.$y + '-' + (newValue.$M + 1) + '-' + newValue.$D)); setDepartureDate(newValue) }} label='Departure Date' sx={way === 'Two Way' ? {
                        width: '25%', "& .MuiOutlinedInput-root": {
                            color: "#C2C6CA",
                        },
                        "& .MuiInputLabel-root": {
                            color: "#C2C6CA",
                        },
                        "& .MuiOutlinedInput-input": { 
                            color: "#C2C6CA" 
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "lightgray"
                        }
                    } : {
                        width: '50%', "& .MuiOutlinedInput-root": {
                            color: "#C2C6CA",
                        },
                        "& .MuiInputLabel-root": {
                            color: "#C2C6CA",
                        },
                        "& .MuiOutlinedInput-input": { 
                            color: "#C2C6CA" 
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "lightgray"
                        }
                    }} />
                    {/* Date picker return date bugunu fixle */}
                    {way === 'Two Way' && <DatePicker className='datePicker' disablePast minDate={departureDate} label='Return Date' format='YYYY/MM/DD' value={returnDate} onChange={(newValue) => { setReturnValue(newValue.$y + '-' + (newValue.$M + 1) + '-' + newValue.$D); setReturnDate(newValue) }} sx={{
                        width: '25%', "& .MuiOutlinedInput-root": {
                            color: "#C2C6CA",
                        },
                        "& .MuiInputLabel-root": {
                            color: "#C2C6CA",
                        },
                        "& .MuiOutlinedInput-input": { 
                            color: "#C2C6CA" 
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "gray",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "lightgray"
                        }
                    }} />}
                </LocalizationProvider>
            </div>
            <Button onClick={searchFlights} sx={{ borderRadius: '2em' }} variant="contained" classes={{ disabled: 'disabledSearchBtn' }} disabled={searchLoading || (originSkyId && destinationID && originEntityId && destinationEntityID && departureValue && returnValue && flightClassValue ? false : true)} className='searchBtn' startIcon={!searchLoading ? <SearchIcon /> : <RefreshIcon className='loadingIcon' />}>
                Search
            </Button>
        </div>
    );
}
