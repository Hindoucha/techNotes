import React from 'react'
import Navbar from '../partials/Navbar'
import Hero from '../partials/Hero'
const Public = () => {
  return(
    <>
    <Navbar>
      <div className='n-left'>Dan D. Repairs</div>
      <div className='n-right'>
        <div className='btn'>login</div>
      </div>
    </Navbar>
    <Hero>
      <div className="h-left">
        <h1>Welcom to Dan D. Repairs !</h1>
        <h3>Located in Beautifull Downtwon Foo City Dan D. Repairs provides a trained stuff ready to meet your tech reapir needs.</h3>
        <div>
          <p>Dan D. Repairs</p>
          <p>500 Foo Drive</p>
          <p>Foo City CA 12345</p>
          <p>(555) 555.5555</p>
        </div>
      </div>
      <div className="h-right">
        {/** comming soon */}
      </div>
    </Hero>
    </>
  )
}

export default Public