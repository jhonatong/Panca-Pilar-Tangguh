package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"panca-pilar-backend/database"
	"panca-pilar-backend/handlers"
)

func main() {
	// 1. Connect to PostgreSQL via GORM (graceful — offline mode if DB unavailable)
	database.ConnectDB()

	// 2. Initialize Gin router
	r := gin.Default()

	// 3. CORS middleware for Next.js frontend on port 3000
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, PATCH, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 4. API v1 Routes
	api := r.Group("/api/v1")
	{
		// Health
		api.GET("/health", handlers.HealthCheck)

		// Branches
		api.GET("/branches", handlers.GetBranches)
		api.GET("/branches/:id", handlers.GetBranchByID)

		// Products (FMCG showcase)
		api.GET("/products", handlers.GetProducts)

		// IT Assets (full CRUD)
		api.GET("/assets", handlers.GetAssets)
		api.GET("/assets/:id", handlers.GetAssetByID)
		api.POST("/assets", handlers.CreateAsset)
		api.PUT("/assets/:id", handlers.UpdateAsset)
		api.DELETE("/assets/:id", handlers.DeleteAsset)

		// Helpdesk Tickets (full CRUD)
		api.GET("/tickets", handlers.GetTickets)
		api.GET("/tickets/:id", handlers.GetTicketByID)
		api.POST("/tickets", handlers.CreateTicket)
		api.PATCH("/tickets/:id/status", handlers.UpdateTicketStatus)

		// B2B Partnership Requests
		api.GET("/b2b-requests", handlers.GetB2BRequests)
		api.POST("/b2b-requests", handlers.CreateB2BRequest)

		// Dashboard aggregate stats
		api.GET("/stats", handlers.GetDashboardStats)
	}

	port := ":8080"
	fmt.Printf("🚀 Panca Pilar Backend (Go/Gin) · http://localhost%s\n", port)
	fmt.Printf("📊 API Docs: GET http://localhost%s/api/v1/health\n", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Server gagal start: %v", err)
	}
}
