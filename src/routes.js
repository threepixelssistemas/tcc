import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Map from './pages/Map'

const Routes = createAppContainer(
    createStackNavigator({
        Map: { screen: Map },
    }, {
            initialRouteName: 'Map',
            headerMode: 'none',
            mode: 'modal',
            headerBackTitleVisible: false
        })
)

export default Routes