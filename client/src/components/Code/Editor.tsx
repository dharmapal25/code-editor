import React from 'react'
import { BiRefresh, BiRightArrow } from 'react-icons/bi'
import './Editor.css'
function Editor() {
    return (
        <div className='editor__container'>

            <div className="input__container">

                <div className="input__header">
                    <span className="file_name">main.js</span>
                    <button className='run__button'> <BiRightArrow /> Run</button>
                </div >

                <div className="input__body">
                    <textarea className='input__textarea code-section' placeholder='Write your code here...'></textarea>
                </div>

            </div>


            <div className="output__container">

                <div className="output__header">
                    <span className="headline">Output</span>
                    <button className='run__button'> <BiRefresh fontSize={20} /> </button>
                </div>

                <div className="output__body">
                    <textarea className='output__textarea code-section' ></textarea>
                </div>
            </div>

        </div >
    )
}

export default Editor