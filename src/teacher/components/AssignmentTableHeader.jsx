import React from 'react'

const AssignmentTableHeader = () => {
    return (
        <div>
            <div
                className="text-black-800 bg-white  font-normal grid grid-cols-5 py-4 px-8 rounded-lg"
            >
                <div>
                  S/N
                </div>
                <div>Student Name</div>
                <div>Status</div>
                <div>Grade</div>
                <div>
                    comments
                </div>
            </div>

        </div>
    )
}

export default AssignmentTableHeader
