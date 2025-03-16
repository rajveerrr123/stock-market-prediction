# stock-market-prediction
# stock_prediction.py

import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

# Function to fetch stock data from Yahoo Finance
def get_stock_data(ticker, start_date, end_date):
    stock_data = yf.download(ticker, start=start_date, end=end_date)
    return stock_data

# Preprocessing function for data
def preprocess_data(stock_data):
    stock_data['Date'] = stock_data.index
    stock_data['Day'] = stock_data['Date'].dt.day
    stock_data['Month'] = stock_data['Date'].dt.month
    stock_data['Year'] = stock_data['Date'].dt.year
    stock_data = stock_data[['Open', 'High', 'Low', 'Close', 'Volume', 'Day', 'Month', 'Year']]
    return stock_data

# Train the model on the data
def train_model(stock_data):
    X = stock_data[['Open', 'High', 'Low', 'Volume', 'Day', 'Month', 'Year']]
    y = stock_data['Close']
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Use a simple Linear Regression model for prediction
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    return model, X_test, y_test

# Make predictions
def predict_stock(model, X_test):
    predictions = model.predict(X_test)
    return predictions

# Visualize the predictions
def visualize_predictions(y_test, predictions):
    plt.figure(figsize=(10,6))
    plt.plot(y_test.values, color='blue', label='Actual Prices')
    plt.plot(predictions, color='red', label='Predicted Prices')
    plt.title('Stock Price Prediction')
    plt.xlabel('Time')
    plt.ylabel('Stock Price')
    plt.legend()
    plt.show()

# Main function to execute the steps
def main():
    ticker = "AAPL"  # Example ticker symbol for Apple
    start_date = "2020-01-01"
    end_date = "2023-01-01"
    
    # Fetch stock data
    stock_data = get_stock_data(ticker, start_date, end_date)
    
    # Preprocess the data
    stock_data = preprocess_data(stock_data)
    
    # Train the model
    model, X_test, y_test = train_model(stock_data)
    
    # Make predictions
    predictions = predict_stock(model, X_test)
    
    # Visualize the predictions
    visualize_predictions(y_test, predictions)

if __name__ == "__main__":
    main()
