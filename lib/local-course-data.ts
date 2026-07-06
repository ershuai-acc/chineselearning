import { CHINESE_COURSE_GROUPS } from '@/lib/config/chineseCourses';
import { getPinyinGroupsByAlbum } from '@/lib/config/pinyinData';
import { SHADOW_ALBUMS, getAlbumById, getLessonById } from '@/lib/data';

export type LocalLessonSummary = {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  difficulty?: string;
  sentenceCount?: number;
};

export type LocalAlbumInfo = {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
};

export function getLocalAlbumInfo(albumId: string): LocalAlbumInfo | null {
  for (const group of CHINESE_COURSE_GROUPS) {
    const album = group.albums.find(item => item.id === albumId);
    if (album) {
      return {
        id: album.id,
        name: album.name,
        nameEn: album.nameEn,
        icon: album.icon,
      };
    }
  }

  const shadowAlbum = getAlbumById(albumId);
  if (!shadowAlbum) return null;

  return {
    id: shadowAlbum.id,
    name: shadowAlbum.name,
    nameEn: shadowAlbum.nameEn,
    icon: shadowAlbum.icon,
  };
}

export function getLocalLessonsForAlbum(albumId: string): LocalLessonSummary[] {
  const pinyinGroups = getPinyinGroupsByAlbum(albumId);
  if (pinyinGroups.length > 0) {
    const prefix = albumId === 'pinyin-initials'
      ? 'pinyin-initial'
      : albumId === 'pinyin-finals'
        ? 'pinyin-final'
        : 'pinyin-tone';

    return pinyinGroups.map(group => ({
      id: `${prefix}-${group.key}`,
      title: `${group.type === 'initial' ? 'Initial' : group.type === 'final' ? 'Final' : 'Tone'} ${group.label}`,
      titleEn: group.label,
      description: `${group.words.length} practice words`,
      sentenceCount: group.words.length,
    }));
  }

  const shadowAlbum = getAlbumById(albumId);
  if (!shadowAlbum) return [];

  return shadowAlbum.lessons.map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    titleEn: lesson.titleEn,
    description: lesson.description,
    difficulty: lesson.difficulty,
    sentenceCount: Array.isArray(lesson.sentences) ? lesson.sentences.length : undefined,
  }));
}

export function getLocalLessonDetail(lessonId: string) {
  const shadowLesson = getLessonById(lessonId);
  if (shadowLesson) {
    return {
      lesson: shadowLesson.lesson,
      album: {
        id: shadowLesson.album.id,
        name: shadowLesson.album.name,
        nameEn: shadowLesson.album.nameEn,
      },
    };
  }

  for (const albumId of ['pinyin-initials', 'pinyin-finals', 'pinyin-tones']) {
    const group = getPinyinGroupsByAlbum(albumId).find(item => {
      const prefix = albumId === 'pinyin-initials'
        ? 'pinyin-initial'
        : albumId === 'pinyin-finals'
          ? 'pinyin-final'
          : 'pinyin-tone';
      return `${prefix}-${item.key}` === lessonId;
    });

    if (group) {
      return {
        lesson: {
          id: lessonId,
          title: group.label,
          content: {
            type: 'pinyin',
            groupType: group.type,
            key: group.key,
            label: group.label,
            words: group.words,
          },
        },
        album: getLocalAlbumInfo(albumId),
      };
    }
  }

  return null;
}

export function getLocalCourseGroups() {
  return CHINESE_COURSE_GROUPS.map(group => {
    const albums = group.albums
      .map(album => {
        const shadowAlbum = SHADOW_ALBUMS.find(item => item.id === album.id);
        return {
          id: album.id,
          name: album.name,
          nameEn: album.nameEn,
          icon: album.icon,
          description: album.description ?? shadowAlbum?.description ?? null,
          coverImage: album.coverImage ?? null,
        };
      })
      .filter(album => getLocalLessonsForAlbum(album.id).length > 0);

    return {
      id: group.id,
      title: group.title,
      titleEn: group.titleEn,
      albums,
    };
  }).filter(group => group.albums.length > 0);
}
