import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getWeather, getForecast } from '../services/api';

const WeatherIcon = ({ condition }) => {
  const getIconName = () => {
    switch (condition) {
      case 'Rain':
        return 'weather-rainy';
      case 'Clear':
        return 'weather-sunny';
      case 'Clouds':
        return 'weather-cloudy';
      default:
        return 'weather-cloudy';
    }
  };

  return <MaterialIcons name={getIconName()} size={50} color="white" />;
};

const DetailsScreen = ({ route }) => {
  const { city } = route.params;
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async () => {
    setLoading(true);
    const weatherData = await getWeather(city);
    const forecastData = await getForecast(city);
    
    if (weatherData && forecastData) {
      setWeather(weatherData);
      setForecast(forecastData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  };

  const getDayOfWeek = (date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[new Date(date).getDay()];
  };

  return (
    <LinearGradient colors={['#8B7AB8', '#6A5ACD']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Detalhes do Clima</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <ScrollView>
          {weather && (
            <View style={styles.currentWeather}>
              <Text style={styles.temperature}>
                {Math.round(weather.main.temp)}°C
              </Text>
              <WeatherIcon condition={weather.weather[0].main} />
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={24} color="white" />
                <Text style={styles.location}>
                  {weather.name}, {weather.sys.country}
                </Text>
              </View>
              <Text style={styles.date}>{formatDate(new Date())}</Text>

              <View style={styles.additionalDetails}>
                <Text style={styles.detailText}>Sensação Térmica: {Math.round(weather.main.feels_like)}°C</Text>
                <Text style={styles.detailText}>Pressão: {weather.main.pressure} hPa</Text>
                <Text style={styles.detailText}>Visibilidade: {weather.visibility / 1000} km</Text>
              </View>
            </View>
          )}

          {forecast && (
            <View style={styles.forecast}>
              <Text style={styles.forecastTitle}>Previsão para os próximos dias</Text>
              {forecast.list.slice(0, 5).map((day, index) => (
                <View key={index} style={styles.forecastDay}>
                  <Text style={styles.forecastText}>
                    {getDayOfWeek(day.dt_txt)}: {Math.round(day.main.humidity)}% |{' '}
                    {Math.round(day.main.temp_min)}° -{' '}
                    {Math.round(day.main.temp_max)}°
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 30,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 5,
  },
  date: {
    fontSize: 18,
    color: '#fff',
  },
  additionalDetails: {
    marginTop: 20,
  },
  detailText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  forecast: {
    marginTop: 20,
  },
  forecastTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  forecastDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default DetailsScreen;
