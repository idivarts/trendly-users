import Colors from '@/shared-uis/constants/Colors';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Alert, Linking, Pressable, StyleSheet } from 'react-native';
import { DefaultStreamChatGenerics, MessageInputContextValue, useMessageInputContext, useTheme, useTranslationContext } from 'stream-chat-expo';

import {
  useTheme as useAppTheme,
} from '@react-navigation/native';
import { AudioRecordingReturnType, triggerHaptic } from './native';

type AudioRecordingButtonPropsWithContext<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
> = Pick<MessageInputContextValue<StreamChatGenerics>, 'asyncMessagesMinimumPressDuration'> & {
  /**
   * The current voice recording that is in progress.
   */
  recording: AudioRecordingReturnType;
  /**
   * Size of the mic button.
   */
  buttonSize?: number;
  /**
   * Handler to determine what should happen on long press of the mic button.
   */
  handleLongPress?: () => void;
  /**
   * Handler to determine what should happen on press of the mic button.
   */
  handlePress?: () => void;
  /**
   * Boolean to determine if the audio recording permissions are granted.
   */
  permissionsGranted?: boolean;
  /**
   * Function to start the voice recording.
   */
  startVoiceRecording?: () => Promise<void>;
};

const AudioRecordingButtonWithContext = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  props: AudioRecordingButtonPropsWithContext<StreamChatGenerics>,
) => {
  const {
    asyncMessagesMinimumPressDuration,
    buttonSize,
    handleLongPress,
    handlePress,
    permissionsGranted,
    recording,
    startVoiceRecording,
  } = props;

  const {
    theme: {
      colors: { grey, light_gray, white },
      messageInput: {
        audioRecordingButton: { container, micIcon },
      },
    },
  } = useTheme();
  const appTheme = useAppTheme();
  const { t } = useTranslationContext();

  const onPressHandler = () => {
    if (handlePress) {
      handlePress();
    }
    if (!recording) {
      triggerHaptic('notificationError');
      Alert.alert(t('Hold to start recording.'));
    }
  };

  const onLongPressHandler = () => {
    if (handleLongPress) {
      handleLongPress();
      return;
    }
    if (!recording) {
      triggerHaptic('impactHeavy');
      if (!permissionsGranted) {
        Alert.alert(t('Please allow Audio permissions in settings.'), '', [
          {
            onPress: () => {
              Linking.openSettings();
            },
            text: t('Open Settings'),
          },
        ]);
        return;
      }
      if (startVoiceRecording) startVoiceRecording();
    }
  };

  return (
    <Pressable
      delayLongPress={asyncMessagesMinimumPressDuration}
      onLongPress={onLongPressHandler}
      onPress={onPressHandler}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? light_gray : white,
          height: buttonSize || 40,
          width: buttonSize || 40,
        },
        container,
      ]}
      testID='audio-button'
    >
      <FontAwesomeIcon
        color={Colors(appTheme).primary}
        icon={faMicrophone}
        size={22}
      />
    </Pressable>
  );
};

const areEqual = <StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics>(
  prevProps: AudioRecordingButtonPropsWithContext<StreamChatGenerics>,
  nextProps: AudioRecordingButtonPropsWithContext<StreamChatGenerics>,
) => {
  const {
    asyncMessagesMinimumPressDuration: prevAsyncMessagesMinimumPressDuration,
    recording: prevRecording,
  } = prevProps;
  const {
    asyncMessagesMinimumPressDuration: nextAsyncMessagesMinimumPressDuration,
    recording: nextRecording,
  } = nextProps;

  const asyncMessagesMinimumPressDurationEqual =
    prevAsyncMessagesMinimumPressDuration === nextAsyncMessagesMinimumPressDuration;
  if (!asyncMessagesMinimumPressDurationEqual) return false;

  const recordingEqual = prevRecording === nextRecording;
  if (!recordingEqual) return false;

  return true;
};

const MemoizedAudioRecordingButton = React.memo(
  AudioRecordingButtonWithContext,
  areEqual,
) as typeof AudioRecordingButtonWithContext;

export type AudioRecordingButtonProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
> = Partial<AudioRecordingButtonPropsWithContext<StreamChatGenerics>> & {
  recording: AudioRecordingReturnType;
};

/**
 * Component to display the mic button on the Message Input.
 */
export const AudioRecordingButton = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  props: AudioRecordingButtonProps<StreamChatGenerics>,
) => {
  const { asyncMessagesMinimumPressDuration } = useMessageInputContext<StreamChatGenerics>();

  return <MemoizedAudioRecordingButton {...{ asyncMessagesMinimumPressDuration }} {...props} />;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
  },
});

AudioRecordingButton.displayName = 'AudioRecordingButton{messageInput}';
