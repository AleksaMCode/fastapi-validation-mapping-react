from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserType(str, Enum):
    admin = "admin"
    user = "user"


class NewDataRequest(BaseModel):
    name: str
    email: EmailStr
    company_id: UUID
    type: UserType
    startdate: datetime
