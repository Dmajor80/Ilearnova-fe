# API Integration Plan for UI Components

## Overview
Integrate UI components that currently use mock data with actual API calls to ensure they are well-fetched and integrated.

## Components to Integrate

### 1. Parent Messages (ParentMessages.jsx) ✅ COMPLETED
- **Current State**: Now fetches data from APIs with fallback to local state
- **Required APIs**:
  - Announcements API: `/api/announcements` (GET) - `announcementApi.getAnnouncements()`
  - Messages API: Use existing `communicationApi.getMessages` and `communicationApi.sendMessage`
- **Tasks Completed**:
  - ✅ Created `announcementApi.js` with functions for fetching announcements
  - ✅ Updated ParentMessages.jsx to fetch announcements from API on component mount
  - ✅ Updated chat functionality to use communicationApi for sending messages
  - ✅ Added proper error handling and loading states
  - ✅ Added fallback to local state if API calls fail

### 2. Payment/Subscription (VoucherList.jsx)
- **Current State**: Uses mock voucher data
- **Required APIs**:
  - Voucher API: `/api/vouchers` (GET, POST, PUT, DELETE)
- **Tasks**:
  - Create `voucherApi.js` with CRUD functions for vouchers
  - Update VoucherList.jsx to fetch vouchers from API
  - Update VoucherCreation.jsx and VoucherRedemption.jsx accordingly

### 3. Transcript/Testimonial (TranscriptViewer.jsx)
- **Current State**: Uses mock transcript data
- **Required APIs**:
  - Transcript API: `/api/transcripts` (GET)
- **Tasks**:
  - Create `transcriptApi.js` with functions for fetching transcripts
  - Update TranscriptViewer.jsx to fetch transcripts from API

### 4. E-Reports Card / Mark book
- **Current State**: Likely needs integration (check StudentDashboard or similar)
- **Required APIs**:
  - Use existing `gradeApi.getStudentReportCard` and `gradeApi.getGradesByStudent`
- **Tasks**:
  - Identify the component that displays reports/grades
  - Ensure it uses gradeApi functions

## Implementation Steps

1. **Create Missing API Files**:
   - announcementApi.js
   - voucherApi.js
   - transcriptApi.js

2. **Update Components**:
   - Replace mock data with API calls
   - Add loading states and error handling
   - Update state management to handle API responses

3. **Test Integration**:
   - Verify API calls work correctly
   - Handle loading and error states properly
   - Ensure UI updates reflect API data

## Dependencies
- Ensure backend APIs are available and match the expected endpoints
- Update api/index.js to export new API functions if needed
