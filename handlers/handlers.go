package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"panca-pilar-backend/database"
	"panca-pilar-backend/models"
)

// ─── Health ──────────────────────────────────────────────────────────────────

func HealthCheck(c *gin.Context) {
	dbStatus := "offline (mock data mode)"
	if database.DB != nil {
		dbStatus = "connected"
	}
	c.JSON(http.StatusOK, gin.H{
		"status":    "online",
		"system":    "PT Panca Pilar Tangguh — Go REST API",
		"version":   "v1.1.0",
		"db":        dbStatus,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// ─── Branches ────────────────────────────────────────────────────────────────

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

func GetBranchByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	if database.DB == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Database tidak tersedia"})
		return
	}
	var branch models.Branch
	if err := database.DB.First(&branch, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Depo tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": branch})
}

// ─── Products ────────────────────────────────────────────────────────────────

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
	category := c.Query("category")
	query := database.DB.Model(&models.Product{})
	if category != "" {
		query = query.Where("category = ?", category)
	}
	var products []models.Product
	if err := query.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": products, "count": len(products)})
}

// ─── IT Assets ───────────────────────────────────────────────────────────────

func GetAssets(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []gin.H{
				{"id": 1, "asset_tag": "AST-MDN-PDA-001", "name": "Honeywell EDA51 Sales PDA", "category": "Sales PDA / SFA Device", "condition": "good", "status": "in_use", "branch_name": "Depo Medan Marelan"},
				{"id": 2, "asset_tag": "AST-SUB-LTP-004", "name": "Lenovo ThinkPad L14 Gen 3", "category": "Laptop", "condition": "good", "status": "in_use", "branch_name": "Depo Surabaya Rungkut"},
				{"id": 3, "asset_tag": "AST-MDN-PRN-002", "name": "Epson TM-T82X Thermal Receipt Printer", "category": "Printer", "condition": "needs_repair", "status": "under_maintenance", "branch_name": "Depo Medan Marelan"},
				{"id": 4, "asset_tag": "AST-HQ-SRV-001", "name": "Dell PowerEdge R440 Rack Server", "category": "Server / Network", "condition": "good", "status": "in_use", "branch_name": "Headquarters Jakarta"},
			},
		})
		return
	}
	status := c.Query("status")
	branchID := c.Query("branch_id")

	query := database.DB.Preload("Branch").Preload("User")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if branchID != "" {
		query = query.Where("branch_id = ?", branchID)
	}

	var assets []models.ITAsset
	if err := query.Find(&assets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": assets, "count": len(assets)})
}

func GetAssetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	if database.DB == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Database tidak tersedia"})
		return
	}
	var asset models.ITAsset
	if err := database.DB.Preload("Branch").Preload("User").First(&asset, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aset tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": asset})
}

func CreateAsset(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database tidak tersedia"})
		return
	}
	var input struct {
		AssetTag     string  `json:"asset_tag" binding:"required"`
		Name         string  `json:"name" binding:"required"`
		Category     string  `json:"category" binding:"required"`
		SerialNumber string  `json:"serial_number"`
		Condition    string  `json:"condition"`
		Status       string  `json:"status"`
		BranchID     uint    `json:"branch_id" binding:"required"`
		UserID       *uint   `json:"user_id"`
		Notes        string  `json:"notes"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	asset := models.ITAsset{
		AssetTag:     input.AssetTag,
		Name:         input.Name,
		Category:     input.Category,
		SerialNumber: input.SerialNumber,
		Condition:    input.Condition,
		Status:       input.Status,
		BranchID:     input.BranchID,
		UserID:       input.UserID,
		Notes:        input.Notes,
	}
	if asset.Condition == "" {
		asset.Condition = "good"
	}
	if asset.Status == "" {
		asset.Status = "available"
	}
	if err := database.DB.Create(&asset).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "created", "data": asset})
}

func UpdateAsset(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database tidak tersedia"})
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	var asset models.ITAsset
	if err := database.DB.First(&asset, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aset tidak ditemukan"})
		return
	}
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Model(&asset).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated", "data": asset})
}

func DeleteAsset(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database tidak tersedia"})
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	if err := database.DB.Delete(&models.ITAsset{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted", "id": id})
}

// ─── IT Tickets ───────────────────────────────────────────────────────────────

func GetTickets(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []gin.H{
				{"id": 1, "ticket_code": "TKT-202611-0001", "subject": "SFA Mobile App scanner gagal sync inventory", "category": "Software / SFA App", "priority": "high", "status": "in_progress"},
				{"id": 2, "ticket_code": "TKT-202611-0002", "subject": "Printer invoice thermal warehouse cetak huruf acak", "category": "Printer & Network", "priority": "medium", "status": "open"},
				{"id": 3, "ticket_code": "TKT-202611-0003", "subject": "Koneksi VPN Depo Makassar terputus ke HQ", "category": "Jaringan & VPN", "priority": "critical", "status": "open"},
			},
		})
		return
	}
	status := c.Query("status")
	priority := c.Query("priority")
	branchID := c.Query("branch_id")

	query := database.DB.Preload("Branch").Preload("User")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if priority != "" {
		query = query.Where("priority = ?", priority)
	}
	if branchID != "" {
		query = query.Where("branch_id = ?", branchID)
	}

	var tickets []models.Ticket
	if err := query.Order("created_at DESC").Find(&tickets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": tickets, "count": len(tickets)})
}

func GetTicketByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	if database.DB == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Database tidak tersedia"})
		return
	}
	var ticket models.Ticket
	if err := database.DB.Preload("Branch").Preload("User").First(&ticket, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tiket tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": ticket})
}

func CreateTicket(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database tidak tersedia"})
		return
	}
	var input struct {
		Category    string `json:"category" binding:"required"`
		Priority    string `json:"priority" binding:"required"`
		Subject     string `json:"subject" binding:"required"`
		Description string `json:"description"`
		BranchID    uint   `json:"branch_id" binding:"required"`
		UserID      uint   `json:"user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	now := time.Now()
	ticketCode := fmt.Sprintf("TKT-%s-%04d", now.Format("200601"), now.Unix()%10000)

	ticket := models.Ticket{
		TicketCode:  ticketCode,
		Category:    input.Category,
		Priority:    input.Priority,
		Subject:     input.Subject,
		Description: input.Description,
		Status:      "open",
		BranchID:    input.BranchID,
		UserID:      input.UserID,
	}
	if err := database.DB.Create(&ticket).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "created", "data": ticket})
}

func UpdateTicketStatus(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database tidak tersedia"})
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}
	var input struct {
		Status string `json:"status" binding:"required"`
		Notes  string `json:"notes"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	validStatuses := map[string]bool{"open": true, "in_progress": true, "resolved": true, "closed": true}
	if !validStatuses[input.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status tidak valid. Gunakan: open, in_progress, resolved, closed"})
		return
	}
	var ticket models.Ticket
	if err := database.DB.First(&ticket, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tiket tidak ditemukan"})
		return
	}
	updates := map[string]interface{}{"status": input.Status}
	if input.Notes != "" {
		updates["notes"] = input.Notes
	}
	if err := database.DB.Model(&ticket).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated", "data": ticket})
}

// ─── B2B Partnership Requests ─────────────────────────────────────────────────

func GetB2BRequests(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []gin.H{
				{"id": 1, "store_name": "Toko Kelontong Jaya Abadi", "owner_name": "Haji Mansyur", "city": "Medan", "status": "pending"},
				{"id": 2, "store_name": "Grosir Sembako Rungkut Makmur", "owner_name": "Siti Rahmawati", "city": "Surabaya", "status": "approved"},
			},
		})
		return
	}
	status := c.Query("status")
	query := database.DB.Model(&models.B2BPartnerRequest{})
	if status != "" {
		query = query.Where("status = ?", status)
	}
	var requests []models.B2BPartnerRequest
	if err := query.Order("created_at DESC").Find(&requests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": requests, "count": len(requests)})
}

func CreateB2BRequest(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database tidak tersedia"})
		return
	}
	var input struct {
		StoreName string `json:"store_name" binding:"required"`
		OwnerName string `json:"owner_name" binding:"required"`
		Phone     string `json:"phone" binding:"required"`
		Address   string `json:"address" binding:"required"`
		City      string `json:"city" binding:"required"`
		Notes     string `json:"notes"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req := models.B2BPartnerRequest{
		StoreName: input.StoreName,
		OwnerName: input.OwnerName,
		Phone:     input.Phone,
		Address:   input.Address,
		City:      input.City,
		Status:    "pending",
		Notes:     input.Notes,
	}
	if err := database.DB.Create(&req).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"status": "created", "message": "Permohonan B2B berhasil dikirim", "data": req})
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

func GetDashboardStats(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": gin.H{
				"total_assets":        136,
				"assets_in_use":       117,
				"assets_available":    12,
				"assets_maintenance":  7,
				"total_tickets":       35,
				"tickets_open":        2,
				"tickets_in_progress": 4,
				"tickets_resolved":    29,
				"total_branches":      4,
				"active_deployments":  36,
			},
		})
		return
	}
	var totalAssets, assetsInUse, assetsAvail, assetsMaint int64
	var totalTickets, ticketsOpen, ticketsInProgress, ticketsResolved int64
	var totalBranches int64

	database.DB.Model(&models.ITAsset{}).Count(&totalAssets)
	database.DB.Model(&models.ITAsset{}).Where("status = ?", "in_use").Count(&assetsInUse)
	database.DB.Model(&models.ITAsset{}).Where("status = ?", "available").Count(&assetsAvail)
	database.DB.Model(&models.ITAsset{}).Where("status = ?", "under_maintenance").Count(&assetsMaint)
	database.DB.Model(&models.Ticket{}).Count(&totalTickets)
	database.DB.Model(&models.Ticket{}).Where("status = ?", "open").Count(&ticketsOpen)
	database.DB.Model(&models.Ticket{}).Where("status = ?", "in_progress").Count(&ticketsInProgress)
	database.DB.Model(&models.Ticket{}).Where("status = ?", "resolved").Count(&ticketsResolved)
	database.DB.Model(&models.Branch{}).Where("is_active = ?", true).Count(&totalBranches)

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"total_assets":        totalAssets,
			"assets_in_use":       assetsInUse,
			"assets_available":    assetsAvail,
			"assets_maintenance":  assetsMaint,
			"total_tickets":       totalTickets,
			"tickets_open":        ticketsOpen,
			"tickets_in_progress": ticketsInProgress,
			"tickets_resolved":    ticketsResolved,
			"total_branches":      totalBranches,
		},
	})
}
