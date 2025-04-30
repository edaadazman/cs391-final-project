// This file was done by Saksham Goel
import styled from 'styled-components';
import { useState } from 'react';
import { Shooting } from '../../types';
import NeighborhoodMap from './NeighborhoodMap';

// Styled components for the filter side bar
const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25vw;
  background-color: rgb(30, 30, 30);
  padding: 2vh 1vw 1.5vh 1vw;
  box-sizing: border-box;
  height: 100%;
  border-radius: 0.8vw;
  box-shadow: 0 0.4vh 0.8vh rgba(0, 0, 0, 0.5);
`;

const SidebarTitle = styled.h3`
  font-size: 1.3vw;
  font-weight: 600;
  margin-bottom: 2vh;
  color: rgb(187, 134, 252);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2vh;
`;

const Label = styled.label`
  font-size: 0.95vw;
  margin-bottom: 0.5vh;
  color: rgb(224, 224, 224);
`;

const Select = styled.select`
  padding: 0.8vh 1vw;
  border: 0.1vw solid rgba(255, 255, 255, 0.1);
  border-radius: 0.4vw;
  background: rgb(45, 45, 45);
  color: rgb(224, 224, 224);
  font-size: 0.9vw;
  outline: none;

  &:focus {
    border-color: rgb(187, 134, 252);
  }

  option {
    background-color: rgb(45, 45, 45);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.8vh;
`;

const Checkbox = styled.input`
  margin-right: 1vw;
  accent-color: rgb(187, 134, 252);
`;

const MapWrapper = styled.div`
  height: 25vh;
  width: 100%;
  margin-top: 1vh;
  border: 0.1vw solid rgba(255, 255, 255, 0.1);
  border-radius: 0.4vw;
  overflow: hidden;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1vw;
  margin-top: 2vh;
`;

const ApplyButton = styled.button`
  padding: 0.8vh 1.4vw;
  background-color: rgb(187, 134, 252);
  color: rgb(18, 18, 18);
  border: none;
  border-radius: 0.4vw;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: rgb(199, 161, 252);
    box-shadow: 0 0.2vh 0.4vh rgba(0, 0, 0, 0.4);
  }
`;

const ClearButton = styled.button`
  padding: 0.8vh 1.4vw;
  background-color: rgb(207, 102, 121);
  color: rgb(18, 18, 18);
  border: none;
  border-radius: 0.4vw;
  font-weight: 500;

  &:hover {
    background-color: rgb(217, 126, 142);
    box-shadow: 0 0.2vh 0.4vh rgba(0, 0, 0, 0.4);
  }
`;


// This is the props for the filter bar
interface FilterBarProps {
  shootings: Shooting[];
  onChange: (key: string, value: string[] | string | boolean) => void;
  onClear: () => void;
}

// This is the filter bar component
export default function FilterBar({ shootings, onChange, onClear }: FilterBarProps) {
  // These are the years, shooting types, victim genders, and victim races, for dropdowns
  const years = [...new Set(shootings.map(s => s.attributes.YEAR.toString()))].sort((a, b) => Number(b) - Number(a)); // sorts the years in descending order and uniquely
  const shootingTypes = ["Fatal", "Non-Fatal"];
  const victimGenders = ["Male", "Female", "Unknown"];
  const victimRaces = [
    "Asian",
    "Black or African American",
    "White",
    "Unknown",
  ];

  // useState hooks for the years, neighborhood, shooting type, victim gender, victim race, and multi-victim
  const [year, setYear] = useState<string[]>([]);
  const [neighborhood, setNeighborhood] = useState("");
  const [shootingType, setShootingType] = useState("");
  const [victimGender, setVictimGender] = useState("");
  const [victimRace, setVictimRace] = useState("");
  const [multiVictim, setMultiVictim] = useState(false);

  // This is the function that applies the filters
  const handleApplyFilters = () => {
    onChange('year', year);
    onChange('neighborhood', neighborhood);
    onChange('shootingType', shootingType);
    onChange('victimGender', victimGender);
    onChange('victimRace', victimRace);
    onChange('multiVictim', multiVictim);
  };

  // This is the function that clears the filters
  const handleClearFilters = () => {
    setYear([]);
    setNeighborhood("");
    setShootingType("");
    setVictimGender("");
    setVictimRace("");
    setMultiVictim(false);
    onClear();
  };

  return (
    <SidebarContainer>
      <SidebarTitle>Filter Incidents</SidebarTitle>
      <FilterGroup>
        <Label>Year</Label>
        <div>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={year.length === 0 || year.length === years.length}
              onChange={e => {
                if (e.target.checked) {
                  setYear([...years]);
                } else {
                  setYear([]);
                }
              }}
            />
            <span>All Years</span>
          </CheckboxContainer>
          {years.map(y => (
            <CheckboxContainer key={y}>
              <Checkbox
                type="checkbox"
                checked={year.includes(y)}
                onChange={e => {
                  if (e.target.checked) {
                    setYear(prev => [...prev, y]);
                  } else {
                    setYear(prev => prev.filter(val => val !== y));
                  }
                }}
              />
              <span>{y}</span>
            </CheckboxContainer>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup>
        <Label>Neighborhood</Label>
        <MapWrapper>
          <NeighborhoodMap onNeighborhoodSelect={(name) => setNeighborhood(name)} />
        </MapWrapper>
        {neighborhood && <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#bb86fc' }}>Selected: {neighborhood}</div>}
      </FilterGroup>
      <FilterGroup>
        <Label>Shooting Type</Label>
        <Select value={shootingType} onChange={(e) => setShootingType(e.target.value)}>
          <option value="">All Types</option>
          {shootingTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Victim Gender</Label>
        <Select value={victimGender} onChange={(e) => setVictimGender(e.target.value)}>
          <option value="">All Genders</option>
          {victimGenders.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Victim Race</Label>
        <Select value={victimRace} onChange={(e) => setVictimRace(e.target.value)}>
          <option value="">All Races</option>
          {victimRaces.map(race => (
            <option key={race} value={race}>{race}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={multiVictim}
            onChange={(e) => setMultiVictim(e.target.checked)}
          />
          <span>Multi-Victim</span>
        </CheckboxContainer>
      </FilterGroup>
      <ButtonRow>
        <ApplyButton onClick={handleApplyFilters}>Apply Filters</ApplyButton>
        <ClearButton onClick={handleClearFilters}>Clear Filters</ClearButton>
      </ButtonRow>
    </SidebarContainer>
  );
}
