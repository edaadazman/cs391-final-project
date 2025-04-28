import styled from 'styled-components';
import { useState } from 'react';
import { Shooting } from '../../types';
import NeighborhoodMap from './NeighborhoodMap';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  background-color: #f5f5f5;
  padding: 20px 16px 16px 16px;
  box-sizing: border-box;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SidebarTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 18px;
  color: #222;
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
  color: #222;
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  color: #222;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const Checkbox = styled.input`
  margin-right: 5px;
  accent-color: #f44336;
`;

const MapWrapper = styled.div`
  height: 250px;
  width: 100%;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ApplyButton = styled.button`
  padding: 7px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
`;

const ClearButton = styled.button`
  padding: 7px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
`;

interface FilterBarProps {
  shootings: Shooting[];
  onChange: (key: string, value: string | boolean) => void;
  onClear: () => void;
}

export default function FilterBar({ shootings, onChange, onClear }: FilterBarProps) {
  const years = [...new Set(shootings.map(s => s.attributes.YEAR.toString()))].sort((a, b) => Number(b) - Number(a));
  const shootingTypes = [...new Set(shootings.map(s => s.attributes.Shooting_Type_V2))].filter(Boolean).sort();
  const victimGenders = [...new Set(shootings.map(s => s.attributes.Victim_Gender))].filter(Boolean).sort();
  const victimRaces = [...new Set(shootings.map(s => s.attributes.Victim_Race))].filter(Boolean).sort();

  const [year, setYear] = useState("");
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
    setYear("");
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
        <Select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Neighborhood</Label>
        <MapWrapper>
          <NeighborhoodMap onNeighborhoodSelect={(name) => setNeighborhood(name)} />
        </MapWrapper>
        {neighborhood && <small style={{ marginTop: '4px' }}>Selected: {neighborhood}</small>}
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
