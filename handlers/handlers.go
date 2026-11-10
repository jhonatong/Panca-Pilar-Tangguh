package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"panca-pilar-backend/database"
	"panca-pilar-backend/models"
)

// GetBranches returns all branches
func GetBranches(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []gin.H{
				{"id": 1, "branch_code": "HQ-JKT-01", "branch_name": "Headquarters Jakarta", "city": "Jakarta"},
				{"id": 2, "branch_code": "MDN-MAR-01", "branch_name": "Depo Medan Marelan", "city": "Medan"},
				{"id": 3, "branch_code": "SUB-RNG-01", "branch_name": "Depo Surabaya Rungkut", "city": "Surabaya"},
				{"id": 4, "branch_code": "MKS-BKY-01", "branch_name": "Depo Makassar Biringkanaya", "city": "Makassar"},
			},
		})
		return
	}

	var branches []models.Branch
	if err := database.DB.Find(&branches).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": branches})
}

// GetProducts returns all FMCG products
func GetProducts(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []gin.H{
				{"sku": "TOB-PILAR-MILD-16", "name": "Pilar Supreme Mild 16", "category": "Tobacco & Cigarettes"},
				{"sku": "TOB-PILAR-GOLD-12", "name": "Pilar Gold Kretek 12", "category": "Tobacco & Cigarettes"},
				{"sku": "BEV-FRESH-TEA-350", "name": "Pilar Fresh Jasmine Tea 350ml", "category": "Beverages"},
				{"sku": "SNK-CRISP-BALADO-60", "name": "Nusantara Cassava Chips Balado 60g", "category": "Snacks & Confectionery"},
			},
		})
		return
	}

	var products []models.Product
	if err := database.DB.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": products})
}

// GetAssets returns all IT & SFA devices
func GetAssets(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []gin.H{
				{"asset_tag": "AST-MDN-PDA-001", "name": "Honeywell EDA51 Sales PDA", "category": "Sales PDA / SFA Device", "condition": "good", "status": "in_use"},
				{"asset_tag": "AST-SUB-LTP-004", "name": "Lenovo ThinkPad L14 Gen 3", "category": "Laptop", "condition": "good", "status": "in_use"},
				{"asset_tag": "AST-MDN-PRN-002", "name": "Epson TM-T82X Thermal Receipt Printer", "category": "Printer", "condition": "needs_repair", "status": "under_maintenance"},
			},
		})
		return
	}

	var assets []models.ITAsset
	if err := database.DB.Preload("Branch").Preload("User").Find(&assets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": assets})
}

// GetTickets returns helpdesk tickets
func GetTickets(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []gin.H{
				{"ticket_code": "TKT-202611-0001", "subject": "SFA Mobile App scanner gagal sync inventory", "priority": "high", "status": "in_progress"},
				{"ticket_code": "TKT-202611-0002", "subject": "Printer invoice thermal warehouse cetak huruf acak", "priority": "medium", "status": "open"},
			},
		})
		return
	}

	var tickets []models.Ticket
	if err := database.DB.Preload("Branch").Preload("User").Find(&tickets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": tickets})
}
