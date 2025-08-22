package config

import (
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
}

type DatabaseConfig struct {
	URL        string `mapstructure:"url"`
	Name       string `mapstructure:"name"`
	Collection string `mapstructure:"collection"`
}

func LoadConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	viper.SetEnvPrefix("RECIPES")                          // Set a prefix for environment variables
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_")) // Replace dots with underscores
	viper.AutomaticEnv()                                   // Read environment variables

	if err := viper.ReadInConfig(); err != nil {
		// It's okay if the config file doesn't exist, environment variables might be used
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
	}

	// Set default values
	viper.SetDefault("server.port", ":8080")
	viper.SetDefault("database.url", "mongodb://localhost:27017")
	viper.SetDefault("database.name", "recipes_db")
	viper.SetDefault("database.collection", "recipes")

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}
