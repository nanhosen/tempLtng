import React from 'react'

const imgStyle = {
  alt: 'Login to FireNet',
  zIndex: 100,
  // bottom: 0,
  // right: 0,
  width: '100px',
  height: '43px',
  border: 0,
  borderRadius: '8px'
}

const linkStyle = {
  // position: 'absolute',
  zIndex: 100,
  // bottom: 0,
  // right: 0,
  width: '100px',
  height: '43px',
  border: 0,
}

const src = 'https://sites.google.com/a/firenet.gov/www/_/rsrc/1509560182646/home/FireNet%20Login%20updated.jpg?height=43&amp;width=100'

export default () => 
	<a href={`http://localhost:5000/auth/google`} style={linkStyle}>
		<img style={imgStyle} src={src} />
	</a>
