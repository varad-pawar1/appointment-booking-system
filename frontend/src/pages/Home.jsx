import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import HealtInfoList from '../components/TopHealtInfo'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <HealtInfoList />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home