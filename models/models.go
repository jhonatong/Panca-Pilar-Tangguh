package models

import "time"

// Branch models distribution centers / depos.
type Branch struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	BranchCode string    `gorm:"size:20;uniqueIndex;not null" json:"branch_code"`
	BranchName string    `gorm:"size:150;not null" json:"branch_name"`
	Address    string    `gorm:"type:text;not null" json:"address"`
	City       string    `gorm:"size:100;not null" json:"city"`
	Phone      string    `gorm:"size:30" json:"phone"`
	IsActive   bool      `gorm:"default:true;not null" json:"is_active"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	Users   []User    `gorm:"foreignKey:BranchID" json:"users,omitempty"`
	Assets  []ITAsset `gorm:"foreignKey:BranchID" json:"assets,omitempty"`
	Tickets []Ticket  `gorm:"foreignKey:BranchID" json:"tickets,omitempty"`
}

// User models company employees, managers, and IT support.
type User struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name         string    `gorm:"size:150;not null" json:"name"`
	Email        string    `gorm:"size:150;uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"size:255" json:"-"`
	Role         string    `gorm:"size:50;not null;default:'employee'" json:"role"` // superadmin, it_staff, branch_manager, employee
	BranchID     uint      `gorm:"not null" json:"branch_id"`
	Branch       Branch    `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Product models FMCG goods & tobacco showcase.
type Product struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	SKU         string    `gorm:"size:50;uniqueIndex;not null" json:"sku"`
	Name        string    `gorm:"size:200;not null" json:"name"`
	Category    string    `gorm:"size:100;not null" json:"category"`
	Description string    `gorm:"type:text" json:"description"`
	ImageURL    string    `gorm:"size:255" json:"image_url"`
	IsActive    bool      `gorm:"default:true;not null" json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// B2BPartnerRequest models retail store partnership applications.
type B2BPartnerRequest struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	StoreName string    `gorm:"size:150;not null" json:"store_name"`
	OwnerName string    `gorm:"size:150;not null" json:"owner_name"`
	Phone     string    `gorm:"size:30;not null" json:"phone"`
	Address   string    `gorm:"type:text;not null" json:"address"`
	City      string    `gorm:"size:100;not null" json:"city"`
	Status    string    `gorm:"size:30;default:'pending';not null" json:"status"` // pending, approved, rejected
	Notes     string    `gorm:"type:text" json:"notes"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ITAsset models hardware inventory (Sales PDAs, Laptops, Printers).
type ITAsset struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	AssetTag     string    `gorm:"size:50;uniqueIndex;not null" json:"asset_tag"`
	Name         string    `gorm:"size:150;not null" json:"name"`
	Category     string    `gorm:"size:100;not null" json:"category"`
	SerialNumber string    `gorm:"size:100" json:"serial_number"`
	Condition    string    `gorm:"size:50;default:'good';not null" json:"condition"` // good, needs_repair, damaged
	Status       string    `gorm:"size:50;default:'in_use';not null" json:"status"`   // in_use, in_stock, under_maintenance
	BranchID     uint      `gorm:"not null" json:"branch_id"`
	Branch       Branch    `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	UserID       *uint     `json:"user_id"`
	User         *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Ticket models IT Helpdesk requests.
type Ticket struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	TicketCode  string    `gorm:"size:30;uniqueIndex;not null" json:"ticket_code"`
	Category    string    `gorm:"size:100;not null" json:"category"`
	Priority    string    `gorm:"size:20;default:'medium';not null" json:"priority"` // low, medium, high, critical
	Subject     string    `gorm:"size:200;not null" json:"subject"`
	Description string    `gorm:"type:text;not null" json:"description"`
	Status      string    `gorm:"size:30;default:'open';not null" json:"status"` // open, in_progress, resolved, closed
	BranchID    uint      `gorm:"not null" json:"branch_id"`
	Branch      Branch    `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	User        User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	AssignedTo  *uint     `json:"assigned_to"`
	Assignee    *User     `gorm:"foreignKey:AssignedTo" json:"assignee,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
