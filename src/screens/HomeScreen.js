import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeather, getForecast } from '../services/api';

const WeatherIcon = ({ condition }) => {
    const getIconName = () => {
        switch (condition) {
            case 'Thunderstorm':
                return 'weather-lightning';
            case 'Drizzle':
                return 'weather-rainy';
            case 'Rain':
                return 'weather-pouring';
            case 'Snow':
                return 'weather-snowy';
            case 'Clear':
                return 'weather-sunny';
            case 'Clouds':
                return 'weather-cloudy';
            case 'Mist':
            case 'Fog':
            case 'Smoke':
            case 'Haze':
                return 'weather-fog';
            default:
                return 'weather-partly-cloudy';
        }
    };
    return <MaterialCommunityIcons name={getIconName()} size={80} color="white" />;
};

const HomeScreen = () => {
    const [city, setCity] = useState('Recife');
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
                <Ionicons name="menu" size={24} color="white" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Digite uma cidade"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={city}
                    onChangeText={setCity}
                    onSubmitEditing={fetchWeatherData}
                />
                <Ionicons name="search" size={24} color="white" />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                weather && (
                    <View style={styles.content}>
                        <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
                        <WeatherIcon condition={weather.weather[0].main} />
                        <Text style={styles.city}>{weather.name}, {weather.sys.country}</Text>
                        <Text style={styles.date}>{formatDate(new Date())}</Text>

                        <View style={styles.box}>
                            <Text style={styles.sectionTitle}>Detalhes do Clima</Text>
                            <View style={styles.weatherDetails}>
                                <View style={styles.detailItem}>
                                    <MaterialCommunityIcons name="water" size={30} color="white" />
                                    <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <MaterialCommunityIcons name="weather-cloudy" size={30} color="white" />
                                    <Text style={styles.detailValue}>{weather.clouds.all}%</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <MaterialCommunityIcons name="weather-windy" size={30} color="white" />
                                    <Text style={styles.detailValue}>{weather.wind.speed} km/h</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.box}>
                            <Text style={styles.sectionTitle}>Horários do Sol</Text>
                            <View style={styles.sunTimes}>
                                <View style={styles.sunTimeItem}>
                                    <MaterialCommunityIcons name="weather-sunset-up" size={30} color="white" />
                                    <Text style={styles.sunTime}>
                                        {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                                    </Text>
                                </View>
                                <View style={styles.sunTimeItem}>
                                    <MaterialCommunityIcons name="weather-sunset-down" size={30} color="white" />
                                    <Text style={styles.sunTime}>
                                        {new Date(weather.sys.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {forecast && (
                            <View style={styles.box}>
                                <Text style={styles.sectionTitle}>Previsão para a Semana</Text>
                                <View style={styles.forecast}>
                                    {forecast.list.slice(0, 5).map((day, index) => (
                                        <View key={index} style={styles.forecastDay}>
                                            <Text style={styles.forecastText}>
                                                {getDayOfWeek(day.dt_txt)}: {Math.round(day.main.humidity)}% | {Math.round(day.main.temp_min)}° | {Math.round(day.main.temp_max)}°
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.7)',
        color: '#fff',
        padding: 10,
        marginHorizontal: 10,
        fontSize: 18,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    temperature: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#fff',
    },
    city: {
        fontSize: 24,
        color: '#fff',
        marginVertical: 5,
    },
    date: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 20,
    },
    box: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    detailItem: {
        alignItems: 'center',
    },
    detailValue: {
        fontSize: 18,
        color: '#fff',
    },
    sunTimes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    sunTimeItem: {
        alignItems: 'center',
    },
    sunTime: {
        fontSize: 18,
        color: '#fff',
    },
    forecast: {
        alignItems: 'center',
        width: '100%',
    },
    forecastDay: {
        marginVertical: 5,
    },
    forecastText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    
});

export default HomeScreen;
