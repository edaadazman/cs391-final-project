import styled from 'styled-components';
import { useState } from 'react';
import { Shooting } from '../../types';
import NeighborhoodMap from './NeighborhoodMap';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  background-color: #1e1e1e;
  padding: 20px 16px 16px 16px;
  box-sizing: border-box;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const SidebarTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 18px;
  color: #bb86fc;
  letter-spacing: 0.5px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  margin-bottom: 5px;
  color: #e0e0e0;
`;

const Select = styled.select`
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: #2d2d2d;
  color: #e0e0e0;
  font-size: 0.9rem;
  outline: none;
  
  &:focus {
    border-color: #bb86fc;
  }
  
  option {
    background-color: #2d2d2d;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  accent-color: #bb86fc;
  cursor: pointer;
`;

const MapWrapper = styled.div`
  height: 250px;
  width: 100%;
  margin-top: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ApplyButton = styled.button`
  padding: 8px 14px;
  background-color: #bb86fc;
  color: #121212;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c7a1fc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }
`;

const ClearButton = styled.button`
  padding: 8px 14px;
  background-color: #cf6679;
  color: #121212;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d97e8e;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }
`;

interface FilterBarProps {
  shootings: Shooting[];
  onChange: (key: string, value: string[] | string | boolean) => void;
  onClear: () => void;
}

export default function FilterBar({ shootings, onChange, onClear }: FilterBarProps) {
  const years = [...new Set(shootings.map(s => s.attributes.YEAR.toString()))].sort((a, b) => Number(b) - Number(a));
  const shootingTypes = ["Fatal", "Non-Fatal"];
  const victimGenders = ["Male", "Female", "Unknown"];
  const victimRaces = [
    "Asian",
    "Black or African American",
    "White",
    "Unknown",
    // Add others as needed
  ];

  const [year, setYear] = useState<string[]>([]);
  const [neighborhood, setNeighborhood] = useState("");
  const [shootingType, setShootingType] = useState("");
  const [victimGender, setVictimGender] = useState("");
  const [victimRace, setVictimRace] = useState("");
  const [multiVictim, setMultiVictim] = useState(false);

  const handleApplyFilters = () => {
    onChange('year', year);
    onChange('neighborhood', neighborhood);
    onChange('shootingType', shootingType);
    onChange('victimGender', victimGender);
    onChange('victimRace', victimRace);
    onChange('multiVictim', multiVictim);
  };

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
