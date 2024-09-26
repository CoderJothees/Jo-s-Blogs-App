import React, { useContext } from 'react'
import '../Styles/alertStyling.scss';

function PopUpNotification({ErrType, ErrMsg, setErrNotification}) {
  return (
    <div className='PopNotification'>
        {
            (ErrType == 'red')? (
                    <div className="alert alert-error">
                      <div className="icon__wrapper">
                        <span className="mdi mdi-alert-outline"></span>
                      </div>
                      <p>{ErrMsg}</p>
                      <span className="mdi mdi-open-in-new open"></span>
                      <span className="mdi mdi-close close" onClick={() => setErrNotification(false)}></span>
                    </div>
            ):(
                <div className="alert alert-success">
                      <div className="icon__wrapper">
                        <span className="mdi mdi-alert-outline"></span>
                      </div>
                      <p>{ErrMsg}</p>
                      <span className="mdi mdi-open-in-new open"></span>
                      <span className="mdi mdi-close close" onClick={() => setErrNotification(false)}></span>
                    </div>
            )
        }
    </div>
  )
}

export default PopUpNotification