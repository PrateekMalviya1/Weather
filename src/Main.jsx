import axios from 'axios'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { MdHistory } from "react-icons/md";
import './MainCss.css'
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function Main() {

    //https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric
    // img `https://openweathermap.org/img/w/${weathervar.weather[0].icon}.png`
    let [response,setResponse]=useState(undefined)
    let [show,setShow]=useState(false)
    let [input,setInput]=useState('')
    let his=JSON.parse(localStorage.getItem('WeatherHistory')) ??[];
    
    function sub(event){
        event.preventDefault()
        let city=event.target.InputVal.value
        setInput(city)
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`)
        .then((res)=>res.data)
        .then((finalres)=>setResponse(finalres))
        .catch((err)=>(err.response.status===400)?setResponse(undefined):setResponse({msg:'City not Foud'}))
        event.target.InputVal.value=''
    }
    function historyClick(v){
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${v}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`)
        .then((res)=>res.data)
        .then((finalres)=>setResponse(finalres))
        .catch((err)=>(err.response.status===400)?setResponse(undefined):setResponse({msg:'City not Foud'}))
        setShow(false)
    }

    function history(){
        
            let his=JSON.parse(localStorage.getItem('WeatherHistory')) ??[];
            (his.length >= 12)
            ?
                localStorage.removeItem("WeatherHistory")
            :
                (his.includes(input))
                ?
                    localStorage.setItem("WeatherHistory",JSON.stringify(his))
                :
                    his.push(input)
                    localStorage.setItem("WeatherHistory",JSON.stringify(his))
    }
    
  return (
    <div className='main p-1'>
        <div className='inner-div position-fixed  rounded'>
            <h2 className='text-light text-center'> Weather App </h2>
            <form onSubmit={sub} className='  d-flex  row-gap-1 flex-column align-items-center'>
                <input type="text" autoFocus className='form-control text-center text-light' placeholder='Enter City Name' name='InputVal' />
                <button className='btn btn-outline-light'> Submit </button>
            </form>
            <div className='p-3 text-center text-white'>
                {
                    (response != undefined)?
                    (response.msg=='City not Foud')?
                    <div className='fs-3'>City not found</div>
                    :
                    <div>
                        <Row>
                            {
                                history()
                            }
                            <Col xs={12} lg={5} className=''>
                                <div>
                                    <img src={`https://openweathermap.org/img/w/${response.weather[0].icon}.png`} alt="" className=''/>
                                    <div className='text-center' className='py-2'>
                                        "{response.weather[0].description}"
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} lg={7} className=''>
                            <div>
                                <h2> {response.main.temp} <sup>o</sup>C</h2>
                                <div className='py-1 text-start'>
                                    <ul>
                                        <li key={0} className='country'> {response.name} <span>{response.sys.country}</span> </li>
                                        <li key={1}> Cloud : {response.clouds.all} </li>
                                        <li key={2}> Wind Speed : {response.wind.speed}  </li>
                                        <li key={3}> Max Temp : {response.main.temp_max} </li>
                                        <li key={4}> Min Temp : {response.main.temp_min} </li>
                                    </ul>
                                </div>
                            </div>
                            </Col>
                        </Row>
                    </div>
                    :<div className='fs-3'> Enter City </div>
                }
                
            </div>
        </div>  
        <div>
            <button onClick={()=>setShow(!show)} className='position-fixed bottom-0 btn historyBtn d-flex gap-1 align-items-center btn-outline-light'><MdHistory/> History </button>
        </div>
        <div className={(show)?'show':'hide'}>
            <h3 className='d-flex align-items-center justify-content-between px-2'>
                History 
                <span onClick={()=>setShow(!show)}> <IoMdCloseCircleOutline/> </span> 
            </h3>
            <div className='border-top p-3'>
                {
                    (his.length>0)
                    ?
                        his.map((v,i)=>{
                            return(
                                <div  key={i} onClick={()=>historyClick(v)} className='border m-1 rounded py-1 text-center'>
                                    {v}
                                </div>
                            )
                        })
                    :
                        'NO History'
                }
            </div>
        </div>
    </div>
  )
}
