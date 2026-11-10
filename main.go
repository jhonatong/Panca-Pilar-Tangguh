package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"panca-pilar-backend/database"
	"panca-pilar-backend/handlers"
)

func main() {
	// 1. Connect to PostgreSQL via GORM
	database.ConnectDB()

	// 2. Initialize Gin router
	r := gin.Default()

	// Enable CORS for Next.js frontend
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API Group
	api := r.Group("/api/v1")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "online", "system": "PT Panca Pilar Tangguh Backend Go (GORM)"})
		})
		api.GET("/branches", handlers.GetBranches)
		api.GET("/products", handlers.GetProducts)
		api.GET("/assets", handlers.GetAssets)
		api.GET("/tickets", handlers.GetTickets)
	}

	port := ":8080"
	fmt.Printf("🚀 Panca Pilar Go Backend Server running on port %s\n", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
