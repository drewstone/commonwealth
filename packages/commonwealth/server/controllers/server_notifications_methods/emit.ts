import { NotificationDataAndCategory } from 'types';
import { NotificationInstance } from '../../models/notification';
import emitNotifications from '../../util/emitNotifications';
import { ServerNotificationsController } from '../server_notifications_controller';

export type EmitOptions = {
  notification: NotificationDataAndCategory;
  excludeAddresses?: string[];
  includeAddresses?: string[];
};

export type EmitResult = NotificationInstance;

export async function __emit(
  this: ServerNotificationsController,
  { notification, excludeAddresses, includeAddresses }: EmitOptions,
): Promise<EmitResult> {
  return emitNotifications(
    this.models,
    notification,
    excludeAddresses,
    includeAddresses,
  );
}
