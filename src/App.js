
import { useState } from 'react';
import axios from 'axios';
import './App.css';
import * as XLSX from "xlsx"


//app component
function App() {

  //state management for text area
  const [msg,setmsg]=useState()
  const [status,setstatus]=useState(false)
  const [emailList, setEmailList]=useState([])


  
  //handle user input from text area
  const handlemsg=(event)=>{
    setmsg(event.target.value)
  }

  //sending text area msg to backend and send to Temp Mail
  function send(){
    setstatus(true)
    axios.post("http://localhost:5000/sendemail",{msg:msg,emailList:emailList})
    .then(function(data){
      if(data.data===true){
        alert('Email Send Successfully');
        setstatus(false)
      }
      else{
        alert("Failed");
      }
    })
  }

  function handlefile(event){
    //selecting file from html
    const file=event.target.files[0];
    console.log(file)


    const reader=new FileReader()
    reader.onload = function(e){
        const data=e.target.result
        const workbook=XLSX.read(data,{type:"binary"})
        console.log(workbook)
        const sheetName=workbook.SheetNames[0]
        const worksheet=workbook.Sheets[sheetName]
        const emailList= XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        console.log(emailList)

        //gettting email's from email list array
        const totalemail=emailList.map(function(item){return item.A})
        console.log(totalemail)
        setEmailList(totalemail)
 }
    reader.readAsBinaryString(file)
}

  return (
    <div>
      <div className='bg-emerald-800 text-white text-center p-4'>
        <h1 className='text-2xl font-medium p-4'>Bulk Mail App</h1>
      </div>

      <div className='bg-emerald-600 text-white text-center p-4'>
        <h1 className='text-lg'>We can help your business with sending multiple emails at once</h1>
      </div>


      <div className='bg-emerald-400 font-semibold text-center p-4'>
        <h1 className='text-lg'>Drag and Drop Here</h1>
      </div>

      <div className='bg-emerald-400 flex flex-col items-center text-black p-5 '>
        
        {/* handlechange call */}
        <textarea value={msg} onChange={handlemsg} className='w-[80%] h-32 p-2 outline-none border border-black rounded-sm' placeholder='Enter your email subject here...'></textarea>
        <div className=' '>
          <input onChange={handlefile} type="file" className='border bg-white p-5 my-5 rounded-md ' />
        </div>
        <p className='font-bold rounded-md bg-blue-50 px-2 py-1'>Total Email id in the file : {emailList.length}</p>


        {/* conditional rendering for email send status */}
        <button onClick={send} className='bg-emerald-800 py-2 px-4 mt-5 text-white font-medium rounded-md w-fit'>{status?"Sending...":"Send"}</button>
      </div>

      <div className='bg-emerald-700 text-white text-center py-10'>
        
      </div>

      

    </div>
  );
}

export default App;
