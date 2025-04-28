import { useState, useEffect } from "react";
import styled from 'styled-components';
import { Shooting } from "../../types";
import ShootingPreview from "./ShootingPreview";
import FilterBar from "./FilterBar";

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

export default function ShootingListContent() {
    const [shootings, setShootings] = useState<Shooting[]>([]);
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
                <CardGrid>
                    {filterShootings(shootings).map((shooting) => (
                        <CardWrapper key={shooting.attributes.OBJECTID}>
                            <ShootingPreview
                                shooting={shooting}
                            />
                        </CardWrapper>
                    ))}
                </CardGrid>
            </MainContent>
        </Layout>
    );
}