import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ResourceListPage } from '../pages/ResourceListPage';
import { ReservationCreatePage } from '../pages/ReservationCreatePage';
import { MyReservationsPage } from '../pages/MyReservationsPage';
import { QrCheckPage } from '../pages/QrCheckPage';
import { PenaltyPage } from '../pages/PenaltyPage';
import { StatsPage } from '../pages/StatsPage';
import { AdminPage } from '../pages/AdminPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Resources" component={ResourceListPage} />
      <Tab.Screen name="MyReservations" component={MyReservationsPage} />
      <Tab.Screen name="ProfileStats" component={StatsPage} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginPage} options={{ title: 'KURSU Login' }} />
      <Stack.Screen name="Register" component={RegisterPage} options={{ title: 'Create Account' }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ReservationCreate" component={ReservationCreatePage} options={{ title: 'Create Reservation' }} />
      <Stack.Screen name="QrCheck" component={QrCheckPage} options={{ title: 'QR Check In/Out' }} />
      <Stack.Screen name="Penalty" component={PenaltyPage} options={{ title: 'Penalty and Violations' }} />
      <Stack.Screen name="Admin" component={AdminPage} options={{ title: 'Admin Panel' }} />
    </Stack.Navigator>
  );
}
