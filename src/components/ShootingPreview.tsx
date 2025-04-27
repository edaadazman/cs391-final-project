import styled from 'styled-components';
import { Shooting } from '../../types';

const PreviewCard = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: '#ffe6e6';
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IncidentTitle = styled.h3`
    color: #333;
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
`;

const InfoSection = styled.div`
    display: grid;
    gap: 8px;
`;

const InfoItem = styled.p`
    margin: 8px 0;
`;

const MultiVictimTag = styled.div`
    background-color: #f44336;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    display: inline-block;
    margin-top: 8px;
    font-weight: bold;
`;

interface ShootingPreviewProps {
    shooting: Shooting;
}

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
};

export default function ShootingPreview({ shooting }: ShootingPreviewProps) {
    return (
        <PreviewCard>
            <IncidentTitle>Incident #{shooting.attributes.Incident_Num}</IncidentTitle>
            <InfoSection>
                <InfoItem><strong>Date:</strong> {formatDate(shooting.attributes.Shooting_Date)}</InfoItem>
                <InfoItem><strong>Type:</strong> {shooting.attributes.Shooting_Type_V2}</InfoItem>
                <InfoItem><strong>District:</strong> {shooting.attributes.District}</InfoItem>
                <InfoItem><strong>Neighborhood:</strong> {shooting.attributes.NEIGHBORHOOD}</InfoItem>
                <InfoItem><strong>Victim Gender:</strong> {shooting.attributes.Victim_Gender}</InfoItem>
                <InfoItem><strong>Victim Race:</strong> {shooting.attributes.Victim_Race}</InfoItem>
                <InfoItem><strong>Year:</strong> {shooting.attributes.YEAR}</InfoItem>
                <InfoItem><strong>Day of Week:</strong> {shooting.attributes.DAY_OF_WEEK}</InfoItem>
                <InfoItem><strong>Hour:</strong> {shooting.attributes.HOUR_OF_DAY}:00</InfoItem>
            </InfoSection>
            {shooting.attributes.Multi_Victim === 1 && (
                <MultiVictimTag>Multiple Victims</MultiVictimTag>
            )}
        </PreviewCard>
    );
}