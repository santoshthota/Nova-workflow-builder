# Automation Anywhere App - User Documentation

## Overview

The Automation Anywhere App is a comprehensive process automation platform that enables users to create, manage, and monitor automated business processes. The application provides a clean, intuitive interface for managing process blueprints and jobs through a streamlined navigation system.

## Application Architecture

### Main Layout
- **Left Sidebar Navigation**: Primary navigation with two main tabs
- **Main Content Area**: Dynamic content area that changes based on selected tab
- **Modal System**: Overlay modals for creating and editing resources

### Navigation Structure
The application uses a two-tab navigation system in the left sidebar:
1. **Process Blueprint** - For creating and managing process templates
2. **Jobs** - For managing test and live automation jobs

---

## Tab 1: Process Blueprint

### Purpose
The Process Blueprint tab allows users to create, view, and manage reusable process templates that define the structure and object inputs for automation workflows.

### Core Features

#### 1. Blueprint List View
- **Table Display**: Shows all created blueprints in a structured table format
- **Columns**:
  - Blueprint Name
  - Object Inputs (displayed as tags)
  - Created Date
  - Status (Active/Inactive)
  - Actions (View, Copy, Delete)

#### 2. Blueprint Management Actions

##### View Blueprint
- Displays detailed information about a specific blueprint
- Shows the blueprint's configuration and associated object inputs

##### Copy Blueprint
- Creates a duplicate of an existing blueprint
- Automatically appends "(Copy)" to the name
- Sets creation date to current date

##### Delete Blueprint
- Removes a blueprint from the system
- Includes confirmation dialog to prevent accidental deletion

#### 3. Create New Blueprint Modal

##### Blueprint Information
- **Blueprint Name**: Required text field for naming the blueprint
- **Object Inputs Section**: Dynamic list for adding multiple object types

##### Object Input Management
- **Object Type Dropdown**: Predefined list of available object types:
  - Invoice
  - Purchase Order
  - Customer Query
  - Payment Request
  - Contract
  - Receipt
  - Customer History
  - Account Info
  - Vendor Info
  - Product Catalog

- **Custom Name Field**: Optional field to provide custom names for object types
- **Add/Remove Controls**: 
  - Plus (+) button to add new object input rows
  - Trash button to remove existing rows (minimum one row required)

##### Validation Rules
- Blueprint name is required
- At least one object input must be configured
- Object type must be selected for each row

---

## Tab 2: Jobs

### Purpose
The Jobs tab provides comprehensive management of automation jobs, divided into two categories: Test Jobs for development and validation, and Live Jobs for production automation.

### Sub-Navigation
The Jobs tab includes two sub-tabs:
- **Test Jobs**: For development, testing, and validation
- **Live Jobs**: For production automation processes

---

## Test Jobs Section

### Core Features

#### 1. Test Job List View
- **Table Display**: Shows all test jobs with their current status
- **Columns**:
  - Job Name
  - Spine (Process spine being used)
  - Status (Completed, Running, Failed)
  - Created Date
  - Actions (View Logs, Delete)

#### 2. Test Job Management

##### View Logs
- Opens detailed modal showing job execution logs
- Displays input/output data for each processing stage
- Formatted JSON display for technical details

##### Delete Test Job
- Removes test job from the system
- Includes confirmation dialog
- Represented by trash icon for space efficiency

#### 3. Create Test Job Modal

##### Basic Information
- **Test Job Name**: Required field for job identification
- **Process Spine Selection**: Dropdown with available spine options:
  - Invoice 2way matching
  - Customer support

##### Dynamic Configuration (Spine-Dependent)
When a process spine is selected, additional sections appear:

##### Load Sample Situation
- **Object Field**: Auto-populated based on selected spine
- **Type Selection**: File or JSON input type
- **Data Source**: Choose between "Use Sample Data" or "Add Own Data"

##### Data Section
Varies based on data source selection:
- **Use Sample Data**: Displays pre-configured JSON sample data
- **Add Own Data**: 
  - File upload for File type (supports PDF, JSON, XML, CSV)
  - Text area for JSON type

##### Object-Connector Mapping
Dynamic mapping section that appears based on selected spine:
- **Invoice 2way**: Maps objects like PO object, Goods receipt, etc.
- **Customer Support**: Maps objects like Customer history, Agent request, etc.
- **Connector Options**: AWS S3 PO, Slack Message, MS-365 Email, ERP System, etc.

---

## Live Jobs Section

### Core Features

#### 1. Live Job List View
- **Table Display**: Production-ready jobs with monitoring capabilities
- **Columns**:
  - Job Name
  - Spine
  - Status (Running, Failed, Completed)
  - Active (Toggle switch)
  - Created Date
  - Actions (View Logs, Retry, Delete)

#### 2. Live Job Management

##### Active Toggle
- **Switch Control**: Enable/disable job execution
- **Visual Indicator**: Orange for active, gray for inactive
- **Real-time Control**: Immediate effect on job status

##### Retry Functionality
- **Availability**: Only shown for failed jobs
- **Loading State**: Shows spinner during retry process
- **Status Update**: Automatically updates job status upon successful retry

##### View Logs
- Same functionality as Test Jobs
- Shows production execution data and performance metrics

##### Delete Live Job
- Permanent removal of live job
- Confirmation dialog required
- Affects production automation

#### 3. Create Live Job Modal

##### Basic Configuration
- **Live Job Name**: Required field for production job identification
- **Process Spine Selection**: Same options as test jobs

##### Situation Management
Dynamic section based on selected spine:
- **Invoice 2way Situations**:
  - AWS S3 Invoice
  - Email Invoice Processing
  - API Invoice Intake
  - SFTP Invoice Upload

- **Customer Support Situations**:
  - Email Customer Query
  - Chat Customer Query
  - Phone Customer Query
  - Web Form Customer Query

##### Object-Connector Mapping
Same mapping system as Test Jobs but for production connectors

---

## Common UI Components

### Modal System
- **Overlay Design**: Dark background with centered modal
- **Responsive**: Adapts to content size with maximum height constraints
- **Scroll Support**: Vertical scrolling for long content
- **Close Controls**: X button and Cancel button options

### Form Controls
- **Input Fields**: Consistent styling with orange focus rings
- **Dropdowns**: Select components with search and selection capabilities
- **Buttons**: Primary (orange), secondary (gray), and destructive (red) variants
- **Toggle Switches**: Custom-styled switches for boolean controls

### Status Indicators
- **Badges**: Color-coded status indicators
  - Green: Completed/Active/Success states
  - Blue: Running/In-progress states
  - Red: Failed/Error states
  - Gray: Inactive/Neutral states

### Data Display
- **Tables**: Responsive tables with hover effects
- **JSON Viewers**: Formatted code blocks for technical data
- **Tag Lists**: Compact display for multiple related items

---

## User Workflows

### Creating a Process Blueprint
1. Navigate to Process Blueprint tab
2. Click "New Process Blueprint" button
3. Enter blueprint name
4. Add object inputs by selecting types and optional custom names
5. Use + button to add more inputs, trash button to remove
6. Click "Create Blueprint" to save

### Setting Up a Test Job
1. Navigate to Jobs tab → Test Jobs
2. Click "Create Test Job"
3. Enter job name and select process spine
4. Configure load sample situation based on spine
5. Choose data source and input method
6. Map objects to connectors
7. Click "Create Test Job"

### Managing Live Jobs
1. Navigate to Jobs tab → Live Jobs
2. Use Active toggle to enable/disable jobs
3. Monitor job status through status badges
4. Use Retry button for failed jobs
5. View detailed logs for troubleshooting
6. Create new live jobs following similar process to test jobs

### Monitoring and Maintenance
1. Use View Logs to monitor job execution
2. Check status indicators for system health
3. Use Copy function to duplicate successful blueprints
4. Delete unused resources to maintain clean environment

---

## Sample Data Examples

### Invoice Processing Sample Data
\`\`\`json
{
  "invoiceId": "INV-2024-001",
  "invoiceNumber": "INV-2024-001",
  "vendorId": "VEN-001",
  "vendorName": "Acme Corp",
  "totalAmount": 1500.0,
  "invoiceDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "documentType": "Standard Invoice",
  "poReference": "PO-2024-456",
  "lineItems": [
    {
      "description": "Office Supplies",
      "amount": 750.0,
      "quantity": 10,
      "glCode": "GL-5001"
    },
    {
      "description": "Software License",
      "amount": 750.0,
      "quantity": 1,
      "glCode": "GL-6001"
    }
  ],
  "paymentTerms": "Net 30",
  "taxRate": 0.08,
  "discountAmount": 0,
  "netAmount": 1500.0
}
\`\`\`

### Customer Support Sample Data
\`\`\`json
{
  "queryId": "CQ-2024-001",
  "customerId": "CUST-001",
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "queryType": "Product Issue",
  "priority": "Medium",
  "subject": "Product not working as expected",
  "description": "I purchased your product last week and it's not functioning properly. The device keeps shutting down randomly.",
  "channel": "Email",
  "timestamp": "2024-01-15T10:30:00Z",
  "customerTier": "Gold",
  "previousTickets": 2,
  "productInfo": {
    "productId": "PROD-123",
    "productName": "Smart Device Pro",
    "purchaseDate": "2024-01-08",
    "warrantyStatus": "Active"
  },
  "attachments": [
    {
      "fileName": "error_screenshot.png",
      "fileSize": "2.5MB",
      "fileType": "image"
    }
  ]
}
\`\`\`

---

## Available Object Types

### Process Blueprint Object Types
- Invoice
- Purchase Order
- Customer Query
- Payment Request
- Contract
- Receipt
- Customer History
- Account Info
- Vendor Info
- Product Catalog

### Job Object Mapping Options

#### Invoice Processing Objects
- PO object
- Goods receipt
- Notify vendor
- Review request
- Approval status
- Archive docs

#### Customer Support Objects
- Customer history
- Agent request
- Agent response
- Create ticket
- Update ticket

### Connector Options
- AWS S3 PO
- Slack Message
- MS-365 Email
- ERP System
- Database Connection
- API Webhook
- SFTP Server

---

## Technical Notes

### Data Persistence
- All data is maintained in browser session
- Changes are immediately reflected in the UI
- No external database connections in current implementation

### Validation
- Form validation prevents incomplete submissions
- Required fields are clearly marked
- Confirmation dialogs prevent accidental deletions

### Responsive Design
- Tables scroll horizontally on smaller screens
- Modals adapt to viewport size
- Mobile-friendly touch targets

### Performance
- Efficient state management for real-time updates
- Optimized rendering for large data sets
- Smooth animations and transitions

---

## Support and Troubleshooting

### Common Issues
- **Jobs not starting**: Check Active toggle and connector configurations
- **Failed job status**: Use View Logs to identify specific errors
- **Missing data**: Verify object-connector mappings are complete

### Best Practices
- Use descriptive names for blueprints and jobs
- Test configurations in Test Jobs before creating Live Jobs
- Regularly monitor Live Job status and logs
- Keep object-connector mappings consistent across related jobs

### Status Meanings
- **Running**: Job is actively processing
- **Completed**: Job finished successfully
- **Failed**: Job encountered an error and stopped
- **Active**: Live job is enabled and ready to process
- **Inactive**: Live job is disabled

---

## Keyboard Shortcuts and Tips

### Navigation Tips
- Use the left sidebar to quickly switch between Process Blueprint and Jobs
- Within Jobs, use the sub-tabs to switch between Test and Live jobs
- Modal dialogs can be closed with the X button or Cancel button

### Form Tips
- Required fields are marked and validated before submission
- Dropdown selections trigger dynamic content updates
- File uploads support multiple formats (PDF, JSON, XML, CSV)

### Table Tips
- Click column headers for sorting (where available)
- Use action buttons in the rightmost column for quick operations
- Status badges provide quick visual status identification

---

## Version Information
- **Application Version**: v1.0
- **Documentation Version**: 1.0
- **Last Updated**: January 2024

---

*This documentation covers the current UI implementation of the Automation Anywhere App. For technical implementation details or API documentation, please refer to the developer documentation.*

---

## Appendix

### Glossary
- **Blueprint**: A reusable template that defines process structure and object inputs
- **Job**: An instance of automation execution, either for testing or production
- **Spine**: The underlying process flow that jobs execute against
- **Object**: Data entities that flow through the automation process
- **Connector**: Integration points that connect to external systems
- **Situation**: Predefined scenarios for specific automation contexts

### Contact Information
For additional support or questions about this application, please contact your system administrator or refer to the internal documentation portal.
