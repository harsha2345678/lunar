"""Initial database schema for Lunar Sentry AI

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-11-22

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'analyses',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('progress_pct', sa.Integer(), default=0),
        sa.Column('stage_label', sa.String(length=255), nullable=True),
        sa.Column('gsd_mpp', sa.Float(), default=0.50),
        sa.Column('noise_reduce', sa.Boolean(), default=True),
        sa.Column('contrast_enhance', sa.Boolean(), default=True),
        sa.Column('radiometric_cal', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.current_timestamp()),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
    )
    op.create_table(
        'boulder_detections',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('analysis_id', sa.String(length=64), sa.ForeignKey('analyses.id'), nullable=False),
        sa.Column('boulder_id', sa.String(length=32), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('diameter_m', sa.Float(), nullable=False),
        sa.Column('hazard_class', sa.String(length=32), nullable=False),
        sa.Column('latitude_deg', sa.Float(), nullable=True),
        sa.Column('longitude_deg', sa.Float(), nullable=True),
        sa.Column('bbox_left_pct', sa.Float(), nullable=True),
        sa.Column('bbox_top_pct', sa.Float(), nullable=True),
        sa.Column('bbox_width_pct', sa.Float(), nullable=True),
        sa.Column('bbox_height_pct', sa.Float(), nullable=True),
    )
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('type', sa.String(length=64), nullable=False),
        sa.Column('timestamp_utc', sa.DateTime(), server_default=sa.func.current_timestamp()),
        sa.Column('is_read', sa.Boolean(), default=False),
    )

def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('boulder_detections')
    op.drop_table('analyses')
