import React from 'react'
import Routes from './routes'
import { StatusBar } from 'react-native'

console.disableYellowBox = true;

const App = () => (
    <>
        <StatusBar backgroundColor="#000" barStyle="dark-content" />
        <Routes />
    </>
)
export default App