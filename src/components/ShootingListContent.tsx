import { useState, useEffect } from "react";
import styled from 'styled-components';
import { Shooting } from "../../types";
import ShootingPreview from "./ShootingPreview";
import FilterBar from "./FilterBar";
import ShootingTable from "./ShootingTable";

const Layout = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 80vh;
    padding-top: 30px;
`;

const SidebarWrapper = styled.div`
    flex: 0 0 auto;
`;

const MainContent = styled.div`
    flex: 1 1 0%;
    padding: 0 20px 20px 20px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
`;

const CardGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
`;

const CardWrapper = styled.div`
    flex: 0 0 300px;
    max-width: 400px;
    min-width: 300px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;

  button {
    padding: 6px 12px;
    border: 1px solid #888;
    border-radius: 4px;
    background: white;
    cursor: pointer;

    &:disabled {
      background: #eee;
      cursor: default;
    }
  }
`;

export default function ShootingListContent() {
    const [shootings, setShootings] = useState<Shooting[]>([]);
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [selectedFilters, setSelectedFilters] = useState({
        year: "",
        district: "",
        neighborhood: "",
        shootingType: "",
        victimGender: "",
        victimRace: "",
        multiVictim: false
    });

    useEffect(() => {
        async function getShootings() {
            const res = await fetch(`https://services.arcgis.com/sFnw0xNflSi8J0uh/arcgis/rest/services/Person_Shot_Tbl_view/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`);
            const data = await res.json();
            setShootings(data.features);
        }

        getShootings();
    }, []);

    const handleFilterChange = (key: string, value: string | boolean) => {
        setSelectedFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setSelectedFilters({
            year: "",
            district: "",
            neighborhood: "",
            shootingType: "",
            victimGender: "",
            victimRace: "",
            multiVictim: false
        });
    };

    const filterShootings = (shootings: Shooting[]) => {
        return shootings.filter(shooting => {
            const attrs = shooting.attributes;
            if (selectedFilters.year && attrs.YEAR.toString() !== selectedFilters.year) return false;
            if (selectedFilters.district && attrs.District !== selectedFilters.district) return false;
            if (selectedFilters.neighborhood && attrs.NEIGHBORHOOD !== selectedFilters.neighborhood) return false;
            if (selectedFilters.shootingType && attrs.Shooting_Type_V2 !== selectedFilters.shootingType) return false;
            if (selectedFilters.victimGender && attrs.Victim_Gender !== selectedFilters.victimGender) return false;
            if (selectedFilters.victimRace && attrs.Victim_Race !== selectedFilters.victimRace) return false;
            if (selectedFilters.multiVictim && attrs.Multi_Victim !== 1) return false;
            return true;
        });
    };

    const visible = filterShootings(shootings);

    return (
        <Layout>
            <SidebarWrapper>
                <FilterBar
                    shootings={shootings}
                    onChange={handleFilterChange}
                    onClear={handleClearFilters}
                />
            </SidebarWrapper>
            <MainContent>
                <Title>Boston Shooting Incidents</Title>

                <ToggleWrapper>
                <button onClick={() => setViewMode('card')} disabled={viewMode === 'card'}>
                    Card View
                </button>
                <button onClick={() => setViewMode('table')} disabled={viewMode === 'table'}>
                    Table View
                </button>
                </ToggleWrapper>

                {viewMode === 'card' ? (
                <CardGrid>
                    {visible.map(s => (
                    <CardWrapper key={s.attributes.OBJECTID}>
                        <ShootingPreview shooting={s} />
                    </CardWrapper>
                    ))}
                </CardGrid>
                ) : (
                <ShootingTable shootings={visible} />
                )}
            </MainContent>
        </Layout>
    );
}