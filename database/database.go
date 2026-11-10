package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"panca-pilar-backend/models"
)

var DB *gorm.DB

func ConnectDB() {
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "postgres"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "panca_pilar_tangguh"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("GORM PostgreSQL Connection Warning: %v. Running in offline/detached mode.", err)
		return
	}

	log.Println("PostgreSQL Database connected successfully via GORM!")

	// Auto-migrate tables
	err = DB.AutoMigrate(
		&models.Branch{},
		&models.User{},
		&models.Product{},
		&models.B2BPartnerRequest{},
		&models.ITAsset{},
		&models.Ticket{},
	)
	if err != nil {
		log.Printf("AutoMigrate Error: %v", err)
	}
}
