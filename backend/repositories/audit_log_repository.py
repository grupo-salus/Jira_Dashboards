"""
Repository para operações de logs de auditoria.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from datetime import datetime, timedelta

from .base_repository import BaseRepository
from models.audit_log import AuditLog


class AuditLogRepository(BaseRepository[AuditLog]):
    """Repository para operações de logs de auditoria."""
    
    def __init__(self):
        super().__init__(AuditLog)
    
    def get_logs_by_user(self, user_id: int, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs de um usuário específico."""
        return self.find_by_filters({"user_id": user_id}, skip=skip, limit=limit)
    
    def get_logs_by_action(self, action: str, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs por tipo de ação."""
        return self.find_by_filters({"action": action}, skip=skip, limit=limit)
    
    def get_logs_by_resource_type(self, resource_type: str, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs por tipo de recurso."""
        return self.find_by_filters({"resource_type": resource_type}, skip=skip, limit=limit)
    
    def get_logs_by_date_range(self, start_date: datetime, end_date: datetime, 
                              skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs por período de data."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(
                and_(
                    self.model.created_at >= start_date,
                    self.model.created_at <= end_date
                )
            ).order_by(desc(self.model.created_at)).offset(skip).limit(limit).all()
        finally:
            session.close()
    
    def get_logs_today(self, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs de hoje."""
        today = datetime.utcnow().date()
        start_date = datetime.combine(today, datetime.min.time())
        end_date = datetime.combine(today, datetime.max.time())
        return self.get_logs_by_date_range(start_date, end_date, skip=skip, limit=limit)
    
    def get_logs_this_week(self, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs desta semana."""
        today = datetime.utcnow().date()
        start_date = datetime.combine(today - timedelta(days=today.weekday()), datetime.min.time())
        end_date = datetime.combine(today, datetime.max.time())
        return self.get_logs_by_date_range(start_date, end_date, skip=skip, limit=limit)
    
    def get_logs_this_month(self, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs deste mês."""
        today = datetime.utcnow().date()
        start_date = datetime.combine(today.replace(day=1), datetime.min.time())
        end_date = datetime.combine(today, datetime.max.time())
        return self.get_logs_by_date_range(start_date, end_date, skip=skip, limit=limit)
    
    def get_successful_logs(self, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs bem-sucedidos."""
        return self.find_by_filters({"success": True}, skip=skip, limit=limit)
    
    def get_failed_logs(self, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs que falharam."""
        return self.find_by_filters({"success": False}, skip=skip, limit=limit)
    
    def get_recent_logs(self, limit: int = 100) -> List[AuditLog]:
        """Lista logs mais recentes."""
        session = self._get_session()
        try:
            return session.query(self.model).order_by(
                desc(self.model.created_at)
            ).limit(limit).all()
        finally:
            session.close()
    
    def get_logs_by_ip(self, ip_address: str, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """Lista logs por endereço IP."""
        return self.find_by_filters({"ip_address": ip_address}, skip=skip, limit=limit)
    
    def count_logs_by_user(self, user_id: int) -> int:
        """Conta logs de um usuário."""
        return self.count({"user_id": user_id})
    
    def count_logs_by_action(self, action: str) -> int:
        """Conta logs por ação."""
        return self.count({"action": action})
    
    def count_logs_today(self) -> int:
        """Conta logs de hoje."""
        today = datetime.utcnow().date()
        start_date = datetime.combine(today, datetime.min.time())
        end_date = datetime.combine(today, datetime.max.time())
        
        session = self._get_session()
        try:
            return session.query(self.model).filter(
                and_(
                    self.model.created_at >= start_date,
                    self.model.created_at <= end_date
                )
            ).count()
        finally:
            session.close() 