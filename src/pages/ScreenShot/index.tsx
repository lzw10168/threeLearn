import React, { useEffect, useRef, useState } from 'react';
import ClipScreen from './clipScreen';
const img1 = require('./img2.jpg');
function ScreenShot() {
  const [img, setImg] = useState('');
  let clipScreen: ClipScreen | null = null;
  const divRef = useRef(null);
  const imgRef = useRef(null);

  const success = (data: any) => {
    setImg(data);
  };
  const fail = (err: any) => {
    console.log(err);
  };
  const complete = () => {
    console.log('complete');
  };

  const handleClick = () => {
    clipScreen = new ClipScreen(divRef.current, imgRef.current, {
      success,
      fail,
      complete,
    });
  };
  useEffect(() => {
    return () => {
      // clipScreen.distroy();
    };
  }, []);

  return (
    <>
      <button onClick={handleClick}>截图</button>
      <div
        style={{
          position: 'relative',
        }}
        ref={divRef}
      >
        <img
          ref={imgRef}
          alt=""
          style={{
            width: '100%',
            height: '100%',
          }}
          src={img1}
        />
      </div>
      <img
        style={{
          width: '300px',
          border: '1px solid #f40',
        }}
        src={img}
        alt=""
      />
    </>
  );
}

export default ScreenShot;
