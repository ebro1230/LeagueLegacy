"use client";
import Dropdown from "react-bootstrap/Dropdown";

export default function WeekDayDropdown({
  onDateChange,
  chosenDate,
  weekDays,
}) {
  return weekDays.length ? (
    <div className="season-dropdown-div">
      <Dropdown onSelect={onDateChange}>
        <Dropdown.Toggle className="custom-dropdown-toggle2">
          {chosenDate}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            eventKey="Week"
            key="Week"
            disabled={"Week" === chosenDate}
          >
            Week
          </Dropdown.Item>
          {weekDays.map((day) => (
            <Dropdown.Item
              eventKey={day}
              key={day}
              disabled={day === chosenDate}
            >
              {day}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  ) : null;
}
