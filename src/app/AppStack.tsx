import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';
import CreateElection from '../screens/create_election/CreateElection';
import ElectionDetailScreen from '../screens/election_details/ElectionDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#020617',
        },
        headerTitleStyle: {
          color: '#22c55e',
          fontWeight: '700',
        },
        headerTintColor: '#e5e7eb',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateElection" component={CreateElection} />
      <Stack.Screen
  name="ElectionDetail"
  component={ElectionDetailScreen}
  options={{ title: "Election Details" }}
/>
    </Stack.Navigator>
  );
}
